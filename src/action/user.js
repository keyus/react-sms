export function updateUser(user) {
    return {
        type: 'UPDATEUSER',
        user
    }
}

export function clearUser() {
    return {
        type: 'CLEARUSER',
    }
}
