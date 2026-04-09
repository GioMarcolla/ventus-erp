import * as argon2 from 'argon2';
import type { UserLevel } from '../db/drizzle/UserLevel.schema';

export const PasswordUtil = {
    async hash(password: string): Promise<string> {
        return await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1,
        });
    },

    async verify(password: string, storedHash: string): Promise<boolean> {
        try {
            if (!storedHash || !storedHash.startsWith('$argon2')) return false;
            return await argon2.verify(storedHash, password);
        } catch {
            return false;
        }
    },

    /**
     * Now correctly accessing level.levelNumber from the UserLevel object
     */
    validateForLevel(password: string, level: UserLevel): { valid: boolean; message?: string } {
        const lvNum = level.levelNumber;

        // --- PDV (Level 400) ---
        if (lvNum === 400) {
            return password.length >= 6
                ? { valid: true }
                : { valid: false, message: 'PDV password must be at least 6 characters.' };
        }

        const hasNumbers = /\d/.test(password);
        const hasChars = /[a-zA-Z]/.test(password);

        // --- Padrão (Level 300) ---
        if (lvNum === 300) {
            if (password.length < 8 || !hasNumbers || !hasChars) {
                return {
                    valid: false,
                    message: 'Standard password must be 8+ chars with letters and numbers.',
                };
            }
            return { valid: true };
        }

        // --- Admin/Gerente (Level 100 or 200) ---
        // Note: We check if it's less than 300 to cover all management tiers
        if (lvNum < 300) {
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            if (password.length < 8 || !hasNumbers || !hasChars || !hasSpecial) {
                return {
                    valid: false,
                    message: 'Management password must be 8+ chars with letters, numbers, and symbols.',
                };
            }
            return { valid: true };
        }

        return { valid: false, message: 'Unknown user level hierarchy.' };
    },
};
