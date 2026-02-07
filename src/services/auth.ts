const ADMIN_PASSWORD = 'pnpe2024';

export function login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('auth', 'admin');
        return true;
    }
    return false;
}

export function logout(): void {
    localStorage.removeItem('auth');
}

export function isAuthenticated(): boolean {
    return localStorage.getItem('auth') === 'admin';
}
