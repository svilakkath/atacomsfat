import bcrypt from 'react-native-bcrypt';

export const formatText = (text: string, charLimit: number | undefined) => {
  if (!charLimit) {
    return text;
  }
  if (text.length <= charLimit) {
    return text;
  }
  return text.substring(0, charLimit) + '...';
};

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await new Promise<string>((resolve, reject) => {
      bcrypt.genSalt(5, (err, salts) => {
        if (err || !salts) {
          return reject(err || new Error('Failed to generate salt'));
        }
        resolve(salts);
      });
    });

    const hash = await new Promise<string>((resolve, reject) => {
      bcrypt.hash(password, salt, (err, hashs) => {
        if (err || !hashs) {
          return reject(err || new Error('Failed to hash password'));
        }
        resolve(hashs);
      });
    });

    return hash;
  } catch (error) {
    throw error;
  }
};
