import bcrypt from 'bcrypt';

// Mengambil salt rounds dari environment variable dengan fallback aman ke 12 (Standar Industri)
const getSaltRounds = (): number => {
  const envSaltRounds = process.env.PASSWORD_SALT_ROUNDS;
  if (envSaltRounds) {
    const parsed = parseInt(envSaltRounds, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 12;
};

const SALT_ROUNDS = getSaltRounds();

/**
 * Meng-hash password plain text menggunakan bcrypt secara asinkronus.
 * 
 * @param password Password dalam bentuk plain text yang akan di-hash
 * @returns Promise<string> Password yang sudah di-hash beserta salt-nya
 * @throws Error Jika password kosong, bukan string, atau terjadi kegagalan sistem enkripsi
 */
export async function hashPassword(password: string): Promise<string> {
  if (password === undefined || password === null) {
    throw new Error('Password cannot be null or undefined');
  }

  if (typeof password !== 'string') {
    throw new Error('Password must be a string');
  }

  const trimmedPassword = password.trim();
  if (trimmedPassword === '') {
    throw new Error('Password cannot be empty or blank space');
  }

  try {
    return await bcrypt.hash(trimmedPassword, SALT_ROUNDS);
  } catch (error) {
    // Log error internal secara umum tanpa membocorkan parameter password plain text
    // DILARANG: console.error(`Gagal hash: ${password}`)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to hash password: ${errorMessage}`);
  }
}

/**
 * Membandingkan password plain text dengan hash yang tersimpan di database secara asinkronus.
 * Fungsi ini didesain aman dari timing attack melalui implementasi internal bcrypt.
 * 
 * @param password Password plain text dari input user
 * @param hash Hash password dari database
 * @returns Promise<boolean> True jika cocok, false jika tidak cocok atau input tidak valid
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  // Defensive validation: hindari crash akibat input null/undefined dari database/API request
  if (!password || !hash || typeof password !== 'string' || typeof hash !== 'string') {
    return false;
  }

  const trimmedPassword = password.trim();
  if (trimmedPassword === '' || hash.trim() === '') {
    return false;
  }

  try {
    return await bcrypt.compare(trimmedPassword, hash);
  } catch (error) {
    // Log error sistem (misal: format hash corrupt/invalid) tanpa membocorkan data kredensial
    return false;
  }
}
