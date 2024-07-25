document.addEventListener("DOMContentLoaded", () => {
    const intensitySlider = document.getElementById("intensity");
    const displayValue = document.getElementById("displayValue");
    const controllerStatus = document.getElementById("controllerStatus");

    intensitySlider.addEventListener("input", (event) => {
        const intensity = event.target.value;
        displayValue.textContent = intensity;
        updateGamepadVibration(intensity);
    });

    function updateGamepadVibration(intensity) {
        const gamepads = navigator.getGamepads();
        for (const gamepad of gamepads) {
            if (gamepad && gamepad.vibrationActuator) {
                gamepad.vibrationActuator.playEffect("dual-rumble", {
                    startDelay: 0,
                    duration: 1000,
                    weakMagnitude: intensity / 100,
                    strongMagnitude: intensity / 100,
                });
            }
        }
    }

    function gamepadHandler(event, connecting) {
        const gamepad = event.gamepad;
        if (connecting) {
            controllerStatus.textContent = `Controller connected: ${gamepad.id}`;
        } else {
            controllerStatus.textContent = `Controller disconnected`;
        }
    }

    window.addEventListener("gamepadconnected", (event) => {
        gamepadHandler(event, true);
    });

    window.addEventListener("gamepaddisconnected", (event) => {
        gamepadHandler(event, false);
    });

    function pollGamepads() {
        const gamepads = navigator.getGamepads();
        for (const gamepad of gamepads) {
            if (gamepad) {
                if (gamepad.buttons[0].pressed) {
                    updateGamepadVibration(intensitySlider.value);
                }
            }
        }
        requestAnimationFrame(pollGamepads);
    }

    requestAnimationFrame(pollGamepads);
});
