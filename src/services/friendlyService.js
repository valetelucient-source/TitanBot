const friendlies = new Map();

export function createFriendly(messageId, message) {
    friendlies.set(messageId, {
        players: [],
        message,
        closed: false
    });
}

export function getFriendly(messageId) {
    return friendlies.get(messageId);
}

export function addPlayer(messageId, userId) {
    const friendly = friendlies.get(messageId);

    if (!friendly || friendly.closed) {
        return false;
    }

    if (friendly.players.includes(userId)) {
        return false;
    }

    if (friendly.players.length >= 10) {
        return false;
    }

    friendly.players.push(userId);

    return true;
}

export function removePlayer(messageId, userId) {
    const friendly = friendlies.get(messageId);

    if (!friendly || friendly.closed) {
        return false;
    }

    const index = friendly.players.indexOf(userId);

    if (index === -1) {
        return false;
    }

    friendly.players.splice(index, 1);

    return true;
}

export function closeFriendly(messageId) {
    const friendly = friendlies.get(messageId);

    if (friendly) {
        friendly.closed = true;
    }
}

export function getPlayers(messageId) {
    const friendly = friendlies.get(messageId);

    return friendly ? friendly.players : [];
}
