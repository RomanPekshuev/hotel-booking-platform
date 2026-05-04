import type { Server, Socket } from 'socket.io'
import { randomUUID } from 'crypto'
import { DEFAULT_ROOM } from './chatTypes'
import type {
    ChatJoinAck,
    ChatJoinPayload,
    ChatSendAck,
    ChatSendPayload,
    SocketChatData,
    ChatMessage,
    ChatRoomName,
    ChatNickname,
} from './chatTypes'
import { encryptMessage, decryptMessage } from '../utils/encryptMessage'

// === ФУНКЦИИ ИЗ БЫВШЕГО chatService.ts ===
type MessagesByRoom = Map<ChatRoomName, ChatMessage[]>
const messagesByRoom: MessagesByRoom = new Map()
const MAX_MESSAGES_PER_ROOM = 200
const MAX_TEXT_LENGTH = 500

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

function storeMessage(message: ChatMessage) {
  const current = messagesByRoom.get(message.room) ?? []
  current.push(message)
  if (current.length > MAX_MESSAGES_PER_ROOM) {
    current.splice(0, current.length - MAX_MESSAGES_PER_ROOM)
  }
  messagesByRoom.set(message.room, current)
}

export function getRoomHistory(room: ChatRoomName): ChatMessage[] {
  const history = messagesByRoom.get(room) ?? []
  return history.map(msg => ({
    ...msg,
    text: msg.kind === 'user' ? decryptMessage(msg.text) : msg.text
  }))
}

export function addUserMessage(params: {
  room: ChatRoomName
  nickname: ChatNickname
  text: string
  author?: string
}): ChatMessage {
  const text = normalizeText(params.text)
  if (!text) throw new Error('Сообщение не может быть пустым')
  if (text.length > MAX_TEXT_LENGTH) throw new Error('Сообщение слишком длинное')

  const message: ChatMessage = {
    kind: 'user',
    id: randomUUID(),
    room: params.room,
    author: params.author ?? params.nickname,
    text,
    createdAt: Date.now(),
  }
  storeMessage(message)
  return message
}

export function addSystemMessage(params: {
  room: ChatRoomName
  text: string
}): ChatMessage {
  const text = normalizeText(params.text)
  const message: ChatMessage = {
    kind: 'system',
    id: randomUUID(),
    room: params.room,
    author: 'system',
    text,
    createdAt: Date.now(),
  }
  storeMessage(message)
  return message
}
// === КОНЕЦ ФУНКЦИЙ ИЗ chatService.ts ===

function isValidRoom(room: string): boolean {
    return room.trim().length >= 1 && room.trim().length <= 40
}

function isValidNickname(nickname: string): boolean {
    return nickname.trim().length >= 1 && nickname.trim().length <= 30
}

export function registerChatHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    const socketData = socket.data as SocketChatData
    if (!socketData.room) socketData.room = DEFAULT_ROOM

    socket.on(
      'chat:join',
      (payload: ChatJoinPayload, callback: (ack: ChatJoinAck) => void) => {
        try {
          const room = payload?.room?.toString?.() ?? ''
          const nickname = payload?.nickname?.toString?.() ?? ''

          if (!isValidRoom(room)) {
            callback({ ok: false, error: 'Некорректное имя комнаты' })
            return
          }
          if (!isValidNickname(nickname)) {
            callback({ ok: false, error: 'Некорректное имя' })
            return
          }

          if (socketData.room && socketData.room !== room) {
            socket.leave(socketData.room)
          }

          socketData.room = room
          socketData.nickname = nickname

          socket.join(room)

          const history = getRoomHistory(room)
          socket.emit('chat:history', history)

          const systemMessage = addSystemMessage({
            room,
            text: `${nickname} присоединился(лась)`,
          })
          io.to(room).emit('chat:message', systemMessage satisfies ChatMessage)

          callback({ ok: true })
        } catch (e) {
          callback({
            ok: false,
            error: e instanceof Error ? e.message : 'Ошибка обработки join',
          })
        }
      },
    )

    socket.on(
      'chat:message',
      (payload: ChatSendPayload, callback: (ack: ChatSendAck) => void) => {
        try {
          const room = payload?.room?.toString?.() ?? ''
          const text = payload?.text?.toString?.() ?? ''
          const authorOverride = payload?.author

          if (!socketData.room || socketData.room !== room) {
            callback({ ok: false, error: 'Нет доступа к этой комнате' })
            return
          }
          if (!socketData.nickname) {
            callback({ ok: false, error: 'Сначала выполните join' })
            return
          }

          const author = authorOverride || (socketData.isAdmin ? 'support' : socketData.nickname);
          console.log('[MESSAGE] Итоговый author:', author);

          const encryptedText = encryptMessage(text);

          const message = addUserMessage({
            room,
            nickname: socketData.nickname,
            text: encryptedText,
            author,
          })

          const messageToSend = {
            ...message,
            text: decryptMessage(message.text)
          };

          io.to(room).emit('chat:message', messageToSend satisfies ChatMessage)
          callback({ ok: true })
        } catch (e) {
          callback({
            ok: false,
            error: e instanceof Error ? e.message : 'Ошибка отправки сообщения',
          })
        }
      },
    )

    socket.on('disconnect', () => {
      const room = socketData.room
      const nickname = socketData.nickname
      if (!room || !nickname) return

      const systemMessage = addSystemMessage({
        room,
        text: `${nickname} вышел(ла)`,
      })
      io.to(room).emit('chat:message', systemMessage satisfies ChatMessage)
    })
  })
}