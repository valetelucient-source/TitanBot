```js
const friendlies = new Map();

export function createFriendly(messageId, message) {
    friendlies.set(messageId, {
        players: [],
        goals: [],
        assists: [],
        result: null,
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

export function addGoal(messageId, userId) {
    const friendly = friendlies.get(messageId);

    if (!friendly) {
        return false;
    }

    if (!friendly.players.includes(userId)) {
        return false;
    }

    friendly.goals.push(userId);

    return true;
}

export function addAssist(messageId, userId) {
    const friendly = friendlies.get(messageId);

    if (!friendly) {
        return false;
    }

    if (!friendly.players.includes(userId)) {
        return false;
    }

    friendly.assists.push(userId);

    return true;
}

export function setResult(messageId, result) {
    const friendly = friendlies.get(messageId);

    if (!friendly) {
        return false;
    }

    if (!['win', 'loss', 'draw'].includes(result)) {
        return false;
    }

    friendly.result = result;

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

export function getGoals(messageId) {
    const friendly = friendlies.get(messageId);

    return friendly ? friendly.goals : [];
}

export function getAssists(messageId) {
    const friendly = friendlies.get(messageId);

    return friendly ? friendly.assists : [];
}

export function getResult(messageId) {
    const friendly = friendlies.get(messageId);

    return friendly ? friendly.result : null;
}
```
