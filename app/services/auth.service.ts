export class AuthService {

    public static setCredentials(username: string, password: string) {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('token', btoa(username + ':' + password));
    }

    public static getUsername(): string {
        return sessionStorage.getItem('username');
    }

    public static isAuthenticated(): boolean {
        return sessionStorage.getItem('token') != null;
    }

    public static removeCredentials() {
        sessionStorage.clear();
    }
}
