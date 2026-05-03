import { parentPort } from 'worker_threads';
import { ArcadePhysics } from 'arcade-physics';
import Characters from '../characters.json' assert { type: 'json' };
const screenWidth = 1920;
const screenHeight = 1080;
const targetFPS = 60;
const speedCoefficient = 100;
const ballRay = 26;
const ballBaseSpeed = 6.5;
const pWallSize = {
    width: 85,
    height: 269
};
let workerId = undefined;
let identifier = undefined;
let leftPlayer = undefined;
let rightPlayer = undefined;
let ball = undefined;
let tick = 0;
let generalGameState = 'off';
let lastKickSide = undefined;
let nbCrit = {
    left: 0,
    right: 0
};
let nbBlock = {
    left: 0,
    right: 0
};
let stolenLife = {
    left: 0,
    right: 0
};
const physics = new ArcadePhysics({
    width: screenWidth,
    height: screenHeight,
    gravity: {
        x: 0,
        y: 0
    }
});
function getBaseStats(characterName) {
    return {
        healthPoints: Characters[characterName].hp,
        attackPoints: Characters[characterName].attack,
        defensePoints: Characters[characterName].defense,
        speedPoints: Characters[characterName].speed,
        critChance: (characterName === 'Faeleen' ? 30 : 0),
        blockChance: (characterName === 'Orion' ? 30 : 0),
        lifeSteal: (characterName === 'Thorian' ? 30 : 0)
    };
}
function createBall() {
    ball = {
        body: physics.add.body(screenWidth / 2 - ballRay, screenHeight / 2 - ballRay),
        speed: 0
    };
    ball.body.setCircle(ballRay);
    ball.body.setCollideWorldBounds(true, undefined, undefined, true);
    ball.body.setBounce(1, 1);
    ball.body.onWorldBounds = true;
    physics.world.on('worldbounds', (body, up, down, left, right) => {
        if (body.isCircle && (left || right)) {
            ball.body.onWorldBounds = false;
            const collisionSide = (left ? 'left' : 'right');
            let resolveStatus = resolveGoal(collisionSide);
            if (resolveStatus != 'ended')
                goalTransition(resolveStatus);
            else
                generalGameState = 'off';
        }
    });
}
function initialImpulseBall() {
    lastKickSide = undefined;
    let initialSpeed = speedCoefficient * ballBaseSpeed;
    let randomAngle = Math.random() * 2 * Math.PI;
    ball?.body.setVelocity(initialSpeed * Math.cos(randomAngle), initialSpeed * Math.sin(randomAngle));
}
function recomputeBallSpeed(ballBody) {
    let globalVelocity = Math.sqrt(Math.pow(ballBody.velocity.x, 2) + Math.pow(ballBody.velocity.y, 2));
    let normalX = ballBody.velocity.x / globalVelocity;
    let normalY = ballBody.velocity.y / globalVelocity;
    globalVelocity = (ball.speed + ballBaseSpeed) * speedCoefficient;
    if (globalVelocity > 1500)
        globalVelocity = 1500;
    ballBody.setVelocity(normalX * globalVelocity, normalY * globalVelocity);
}
const rightBallColliderCallback = (playerBody, ballBody) => {
    if (lastKickSide != 'right')
        ball.speed = ball.speed + 1;
    recomputeBallSpeed(ballBody);
    lastKickSide = 'right';
};
const leftBallColliderCallback = (playerBody, ballBody) => {
    if (lastKickSide != 'left')
        ball.speed = ball.speed + 1;
    recomputeBallSpeed(ballBody);
    lastKickSide = 'left';
};
function destroyBall() {
    if (ball) {
        ball.leftUpPWallCollider?.destroy();
        ball.leftUpPWallCollider = undefined;
        ball.leftDownPWallCollider?.destroy();
        ball.leftDownPWallCollider = undefined;
        ball.rightUpPWallCollider?.destroy();
        ball.rightUpPWallCollider = undefined;
        ball.rightDownPWallCollider?.destroy();
        ball.rightDownPWallCollider = undefined;
        ball?.body.destroy();
        ball = undefined;
    }
}
function resetBall() {
    physics.world.removeAllListeners();
    destroyBall();
    createBall();
}
function createPassiveWalls(player) {
    let pWall1 = {
        x: (player.side === 'left' ? 0 : 1920 - pWallSize.width),
        y: 0
    };
    let pWall2 = {
        x: (player.side === 'left' ? 0 : 1920 - pWallSize.width),
        y: 1080 - pWallSize.height
    };
    player.passiveWallBodies = {
        up: physics.add.staticBody(pWall1.x, pWall1.y, pWallSize.width, pWallSize.height),
        down: physics.add.staticBody(pWall2.x, pWall2.y, pWallSize.width, pWallSize.height)
    };
    if (ball) {
        if (player.side === 'left') {
            ball.leftUpPWallCollider = physics.add.collider(ball.body, player.passiveWallBodies.up);
            ball.leftDownPWallCollider = physics.add.collider(ball.body, player.passiveWallBodies.down);
        }
        else {
            ball.rightUpPWallCollider = physics.add.collider(ball.body, player.passiveWallBodies.up);
            ball.rightDownPWallCollider = physics.add.collider(ball.body, player.passiveWallBodies.down);
        }
    }
}
function createPlayerColliders(player) {
    player.body.setCollideWorldBounds(true, undefined, undefined, undefined);
    player.body.setImmovable(true);
    if (ball) {
        let collideCallback = (player.side == 'left' ? leftBallColliderCallback : rightBallColliderCallback);
        player.ballCollider = physics.add.collider(player.body, ball.body, collideCallback);
    }
}
function destroyPlayer(player) {
    player.ballCollider?.destroy();
    player.ballCollider = undefined;
    player.body.destroy();
    player.body = undefined;
}
function createPlayer(construct) {
    let newPlayer = {
        side: construct.side,
        body: physics.add.body(construct.coords.x, construct.coords.y, construct.size.width, construct.size.height),
        character: construct.character,
        achievements: {
            wasNotHit: true,
            hasNotHit: true,
            asBoreas: false,
            asHelios: false,
            asFaeleen: false,
            asGarrick: false,
            asOrion: false,
            asThorian: false
        },
        stats: getBaseStats(construct.character),
        construct: construct
    };
    createPlayerColliders(newPlayer);
    if (newPlayer.character == 'Liliana')
        createPassiveWalls(newPlayer);
    if (leftPlayer)
        rightPlayer = newPlayer;
    else
        leftPlayer = newPlayer;
}
function resetPlayer(player) {
    destroyPlayer(player);
    player.body = physics.add.body(player.construct.coords.x, player.construct.coords.y, player.construct.size.width, player.construct.size.height);
    createPlayerColliders(player);
    if (player.character == 'Liliana')
        createPassiveWalls(player);
}
function updatePlayer(updatedPlayer) {
    const player = (updatedPlayer.side == 'left' ? leftPlayer : rightPlayer);
    const totalSpeed = (speedCoefficient * player.stats.speedPoints);
    let xVel = 0;
    let yVel = 0;
    if (updatedPlayer.keyStates.up)
        yVel = yVel - totalSpeed;
    if (updatedPlayer.keyStates.down)
        yVel = yVel + totalSpeed;
    if (updatedPlayer.keyStates.left)
        xVel = xVel - totalSpeed;
    if (updatedPlayer.keyStates.right)
        xVel = xVel + totalSpeed;
    if (xVel && yVel) {
        xVel = (totalSpeed / 2) * Math.SQRT2 * (xVel / totalSpeed);
        yVel = (totalSpeed / 2) * Math.SQRT2 * (yVel / totalSpeed);
    }
    if (leftPlayer && rightPlayer) {
        if (updatedPlayer.side == leftPlayer.side)
            leftPlayer.body.setVelocity(xVel, yVel);
        else
            rightPlayer.body.setVelocity(xVel, yVel);
    }
}
async function updateState(newStateContainer) {
    switch (newStateContainer.newState) {
        case ('started'):
            if (tick == 0) {
                let playerLife = {
                    left: leftPlayer.stats.healthPoints,
                    right: rightPlayer.stats.healthPoints
                };
                parentPort?.postMessage(playerLife);
                await playCountdown();
                initialImpulseBall();
            }
            generalGameState = 'on';
            break;
        case ('achievements'):
            parentPort?.postMessage({ leftAchiv: leftPlayer.achievements, rightAchiv: rightPlayer.achievements });
            break;
        case ('stopped'):
            generalGameState = 'off';
            break;
    }
}
function resolveGoal(side) {
    let attacker = (side == 'right' ? leftPlayer : rightPlayer);
    let attackee = (side == 'right' ? rightPlayer : leftPlayer);
    let crit = 1;
    if (attacker.stats.critChance)
        crit = (Math.ceil(Math.random() * (100 / attacker.stats.critChance)) == 1 ? 2 : 1);
    if (crit != 1) {
        nbCrit[attacker.side] = nbCrit[attacker.side] + 1;
        if (nbCrit[attacker.side] >= 4) {
            attacker.achievements.asFaeleen = true;
            console.log(identifier, "Faeleen achievement unlocked");
        }
    }
    let attack = attacker.stats.attackPoints * crit;
    let defenseModifier = (attacker.character == 'Rylan' ? 1 / 2 : 1);
    let damage = attack - (attackee.stats.defensePoints * defenseModifier * crit);
    let blocked = 'false';
    if (attackee.character == 'Orion' && Math.ceil(Math.random() * (100 / attackee.stats.blockChance)) == 1 || damage == 0) {
        damage = 0;
        blocked = 'true';
        nbBlock[attacker.side] = nbBlock[attacker.side] + 1;
        if (nbBlock[attacker.side] >= 4) {
            attacker.achievements.asOrion = true;
            console.log(identifier, "Orion achievement unlocked");
        }
    }
    attackee.stats.healthPoints = Math.ceil(attackee.stats.healthPoints - damage);
    if (damage > 0) {
        attackee.achievements.wasNotHit = false;
        attacker.achievements.hasNotHit = false;
    }
    if (attackee.stats.healthPoints < 0)
        attackee.stats.healthPoints = 0;
    if (attackee.stats.healthPoints === 0 && attacker.character === 'Garrick') {
        if (attacker.stats.healthPoints < 10) {
            attacker.achievements.asGarrick = true;
            console.log(identifier, "Garrick achievement unlocked");
        }
    }
    if (blocked == 'false') {
        if (attackee.character == 'Boreas') {
            let buff = attackee.stats.defensePoints - Characters['Boreas'].defense;
            if (buff < 4)
                buff = buff + 1;
            if (buff == 4) {
                attackee.achievements.asBoreas = true;
                console.log(identifier, "Boreas achievement unlocked");
            }
            attackee.stats.defensePoints = Characters['Boreas'].defense + buff;
            console.log(identifier, attackee.side, "Boreas defense is now:", attackee.stats.defensePoints);
        }
        else if (attackee.character == 'Helios') {
            if (attackee.stats.attackPoints != Characters['Helios'].attack)
                console.log(identifier, attackee.side, "Helios attack was reset to:", Characters['Helios'].attack);
            attackee.stats.attackPoints = Characters['Helios'].attack;
        }
        else if (attackee.character == 'Garrick') {
            attackee.stats.attackPoints = Characters['Garrick'].attack + Math.ceil((Characters['Garrick'].hp - attackee.stats.healthPoints) / 10);
            console.log(identifier, attackee.side, "Garrick attack is now:", attackee.stats.attackPoints);
        }
        else if (attackee.character == 'Selene') {
            attacker.stats.speedPoints = Math.ceil(Characters[attacker.character].speed / 2);
            console.log(identifier, attackee.side, "Selene has debuffed ennemy");
        }
        if (attacker.character == 'Boreas') {
            if (attacker.stats.defensePoints != Characters['Boreas'].defense)
                console.log(identifier, attacker.side, "Boreas defense was reset to:", Characters['Boreas'].defense);
            attacker.stats.defensePoints = Characters['Boreas'].defense;
        }
        else if (attacker.character == 'Helios') {
            let buff = attacker.stats.attackPoints - Characters['Helios'].attack;
            if (buff < 4)
                buff = buff + 1;
            if (buff == 4) {
                attacker.achievements.asHelios = true;
                console.log(identifier, "Helios achievement unlocked");
            }
            attacker.stats.attackPoints = Characters['Helios'].attack + buff;
            console.log(identifier, attacker.side, "Helios attack is now:", attacker.stats.attackPoints);
        }
        else if (attacker.character == 'Thorian') {
            let lifeSteal = Math.ceil(damage / (100 / attacker.stats.lifeSteal));
            attacker.stats.healthPoints = attacker.stats.healthPoints + lifeSteal;
            if (attacker.stats.healthPoints > Characters['Thorian'].hp) {
                lifeSteal = lifeSteal - (attacker.stats.healthPoints - Characters['Thorian'].hp);
                attacker.stats.healthPoints = Characters['Thorian'].hp;
            }
            stolenLife[attacker.side] = stolenLife[attacker.side] + lifeSteal;
            if (stolenLife[attacker.side] >= 25) {
                attacker.achievements.asThorian = true;
                console.log(identifier, "Thorian achievement unlocked");
            }
            console.log(identifier, attacker.side, "Thorian health is now:", attacker.stats.healthPoints);
        }
        else if (attacker.character == 'Selene') {
            attackee.stats.speedPoints = Characters[attackee.character].speed;
            console.log(identifier, attacker.side, "Selene debuff was cleared");
        }
    }
    let newLife = {
        left: leftPlayer.stats.healthPoints,
        right: rightPlayer.stats.healthPoints
    };
    parentPort?.postMessage(newLife);
    if (newLife.left == 0 || newLife.right == 0) {
        blocked = 'ended';
        sendState('ended');
    }
    return blocked;
}
function displayAnim(anim) {
    parentPort?.postMessage(anim);
}
function resetEntities() {
    if (leftPlayer && rightPlayer) {
        resetBall();
        resetPlayer(leftPlayer);
        resetPlayer(rightPlayer);
        update();
    }
}
function displayText(event, timeout) {
    return new Promise((resolve) => {
        displayAnim(event);
        setTimeout(() => {
            displayAnim('stop');
            setTimeout(() => {
                resolve();
            }, 100);
        }, (timeout > 100 ? timeout - 100 : 100));
    });
}
async function playCountdown() {
    await displayText('3', 1000);
    await displayText('2', 1000);
    await displayText('1', 1000);
    await displayText('fight', 500);
}
async function goalTransition(blocked) {
    generalGameState = 'off';
    if (blocked == 'false')
        await displayText('goal', 3000);
    else
        await displayText('blocked', 3000);
    resetEntities();
    await playCountdown();
    initialImpulseBall();
    generalGameState = 'on';
}
function isLogin(incomingData) {
    return incomingData.workerId !== undefined;
}
function isConstruct(incomingData) {
    return incomingData.coords !== undefined;
}
function isPlayerUpdate(incomingData) {
    return incomingData.keyStates !== undefined;
}
function isStateUpdate(incomingData) {
    return incomingData.newState !== undefined;
}
function portListener() {
    parentPort?.on('message', (incomingData) => {
        if (isLogin(incomingData)) {
            workerId = incomingData.workerId;
            identifier = '[' + workerId.slice(0, 4) + '] ';
            sendState('ready');
        }
        else if (isConstruct(incomingData)) {
            createPlayer(incomingData);
            if (leftPlayer && rightPlayer)
                sendState('created');
        }
        else if (isPlayerUpdate(incomingData)) {
            updatePlayer(incomingData);
        }
        else if (isStateUpdate(incomingData)) {
            updateState(incomingData);
            sendState(incomingData.newState);
        }
        else {
            console.log(identifier, 'ERROR: Wrong message type');
        }
    });
}
function getProperties(body) {
    return {
        x: body.x,
        y: body.y
    };
}
function sendProperties() {
    if (workerId && leftPlayer && ball && rightPlayer && parentPort) {
        let newProps = {
            workerId: workerId,
            leftProps: getProperties(leftPlayer.body),
            rightProps: getProperties(rightPlayer.body),
            ballProps: getProperties(ball.body)
        };
        parentPort.postMessage(newProps);
    }
}
function sendState(state) {
    if (state != 'achievements')
        parentPort?.postMessage(state);
}
function update() {
    physics.world.update(tick * 1000, 1000 / targetFPS);
    physics.world.postUpdate();
    tick++;
    sendProperties();
}
function main() {
    portListener();
    createBall();
    sendState('init');
    setInterval(() => {
        if (generalGameState === 'on') {
            update();
        }
    }, 1000 / targetFPS);
}
main();
