export const authProvider = {
    login: ({ username, password }) => {
        return fetch('https://car-certify.onrender.com/users/login', {
            method: 'POST',
            body: JSON.stringify({ email: username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        .then(res => res.json())
        .then(({ token, user }) => {
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', user.role); // e.g., 'admin' or 'user'
            } else {
                return Promise.reject();
            }
        });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        return Promise.resolve();
    },
    checkAuth: () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role === 'admin') {
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    },
    checkError: (error) => {
        if (error.status === 401 || error.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => {
        const role = localStorage.getItem('role');
        return role ? Promise.resolve(role) : Promise.reject();
    },
};
