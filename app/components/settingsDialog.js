class settingsDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
            <style>
                .dialog {
                    width: 100%;
                    max-width: 600px;
                }
                .mdl-tabs__panel {
                    padding: 20px;
                }
                .mdl-textfield {
                    width: 100%;
                }
                .mdl-button {
                    margin-top: 20px;
                }
                .hidden {
                    display: none;
                }
            </style>
            <dialog class="mdl-dialog dialog">
                <div class="mdl-dialog__content">
                    <h3>Camera Settings</h3>
                    <div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                        <div class="mdl-tabs__tab-bar">
                            <a href="#camera-panel" class="mdl-tabs__tab is-active">Camera</a>
                            <a href="#settings-panel" class="mdl-tabs__tab">Settings</a>
                            <a href="#capabilities-panel" class="mdl-tabs__tab hidden" id="capabilities-tab">Capabilities</a>
                        </div>

                        <div class="mdl-tabs__panel is-active" id="camera-panel">
                            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                <select class="mdl-textfield__input" id="camera-select"></select>
                                <label class="mdl-textfield__label" for="camera-select">Choose Camera</label>
                            </div>
                        </div>

                        <div class="mdl-tabs__panel" id="settings-panel">
                            <div id="settings-container"></div>
                        </div>

                        <div class="mdl-tabs__panel hidden" id="capabilities-panel">
                            <div id="capabilities-container"></div>
                        </div>
                    </div>
                </div>
                <div class="mdl-dialog__actions mdl-dialog__actions--full-width">
                    <button type="button" class="mdl-button close">Close</button>
                    <button type="button" class="mdl-button mdl-button--colored apply">Apply</button>
                </div>
            </dialog>
        `;

        this.closeButton = this.shadowRoot.querySelector('.close');
        this.applyButton = this.shadowRoot.querySelector('.apply');
        this.cameraSelect = this.shadowRoot.querySelector('#camera-select');
        this.settingsContainer = this.shadowRoot.querySelector('#settings-container');
        this.capabilitiesContainer = this.shadowRoot.querySelector('#capabilities-container');
        this.capabilitiesTab = this.shadowRoot.querySelector('#capabilities-tab');

        this.closeButton.addEventListener('click', () => this.close());
        this.applyButton.addEventListener('click', () => this.applySettings());
    }

    connectedCallback() {
        this.loadCameraOptions();
    }

    loadCameraOptions() {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            videoDevices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || `Camera ${this.cameraSelect.length + 1}`;
                this.cameraSelect.appendChild(option);
            });

            if (videoDevices.length > 0) {
                this.cameraSelect.value = videoDevices[0].deviceId;
                this.loadCameraSettings(videoDevices[0].deviceId);
            }
        });

        this.cameraSelect.addEventListener('change', () => {
            this.loadCameraSettings(this.cameraSelect.value);
        });
    }

    async loadCameraSettings(deviceId) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } });
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            const capabilities = track.getCapabilities ? track.getCapabilities() : null;

            this.populateSettings(settings);
            if (capabilities) {
                this.populateCapabilities(capabilities);
                this.capabilitiesTab.classList.remove('hidden');
            } else {
                this.capabilitiesTab.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error loading camera settings:', error);
        }
    }

    populateSettings(settings) {
        const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
        this.settingsContainer.innerHTML = '';

        for (const constraint in supportedConstraints) {
            if (settings.hasOwnProperty(constraint)) {
                const value = settings[constraint];
                const inputElement = this.createInputElement(constraint, value);
                this.settingsContainer.appendChild(inputElement);
            }
        }
    }

    populateCapabilities(capabilities) {
        this.capabilitiesContainer.innerHTML = '';

        for (const capability in capabilities) {
            const value = capabilities[capability];
            const capabilityElement = this.createCapabilityElement(capability, value);
            this.capabilitiesContainer.appendChild(capabilityElement);
        }
    }

    createInputElement(name, value) {
        const container = document.createElement('div');
        container.classList.add('mdl-textfield', 'mdl-js-textfield', 'mdl-textfield--floating-label');

        const input = document.createElement('input');
        input.classList.add('mdl-textfield__input');
        input.type = 'text';
        input.id = name;
        input.value = value;

        const label = document.createElement('label');
        label.classList.add('mdl-textfield__label');
        label.setAttribute('for', name);
        label.textContent = name;

        container.appendChild(input);
        container.appendChild(label);

        return container;
    }

    createCapabilityElement(name, value) {
        const container = document.createElement('div');
        container.classList.add('mdl-textfield', 'mdl-js-textfield', 'mdl-textfield--floating-label');

        const input = document.createElement('input');
        input.classList.add('mdl-textfield__input');
        input.type = 'text';
        input.id = `cap-${name}`;
        input.value = JSON.stringify(value);
        input.setAttribute('readonly', true);

        const label = document.createElement('label');
        label.classList.add('mdl-textfield__label');
        label.setAttribute('for', `cap-${name}`);
        label.textContent = name;

        container.appendChild(input);
        container.appendChild(label);

        return container;
    }

    applySettings() {
        const settings = {
            deviceId: this.cameraSelect.value,
        };

        this.settingsContainer.querySelectorAll('.mdl-textfield__input').forEach(input => {
            settings[input.id] = input.value;
        });

        this.dispatchEvent(new CustomEvent('apply-camera-settings', { detail: settings }));
        this.close();
    }

    close() {
        this.shadowRoot.querySelector('dialog').close();
    }

    show() {
        this.shadowRoot.querySelector('dialog').showModal();
    }
}

customElements.define('settings-dialog', settingsDialog);
export default settingsDialog;
