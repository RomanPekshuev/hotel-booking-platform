import bcrypt from 'bcryptjs';

const comparePass = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export { comparePass };