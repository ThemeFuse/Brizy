document.addEventListener('DOMContentLoaded', function () {
    function initializeHandler() {
        const openAiModalButton = document.querySelector('.js-open-ai-selection-modal');

        function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        const sessionId = getUrlParameter('sessionId');
        const page = getUrlParameter('page');

        if (page === 'starter-templates' && sessionId.trim() !== '') {
            generateTemplate(sessionId);
        } else if (openAiModalButton) {
            openAiModalButton.addEventListener('click', function (event) {
                event.preventDefault();
                this.disabled = true;
                createSession(this);
            });
        }
    }

    initializeHandler();

    function loadingModal(titleText, descriptionText) {
        const modalElement = document.querySelector('.brz-demo-modal');
        const modalContentContainer = document.querySelector('.brz-demo-modal-content');
        const loadingTemplate = document.getElementById('brz-demo-modal-content-installing');

        if (!modalElement || !modalContentContainer || !loadingTemplate) {
            return;
        }

        modalContentContainer.innerHTML = loadingTemplate.innerHTML;
        modalElement.classList.add('brz-demo-show-modal');

        const modalTitle = modalContentContainer.querySelector('.brz-demo-modal-content-h3');
        const modalDescription = modalContentContainer.querySelector('.brz-demo-modal-content-p');

        if (titleText) {
            if (modalTitle) {
                modalTitle.textContent = titleText;
            }
        }
        if (descriptionText) {
            if (modalDescription) {
                modalDescription.textContent = descriptionText;
            }
        }
    }

    function successModal(titleText, descriptionText, buttonText, editUrl) {
        const modalElement = document.querySelector('.brz-demo-modal');
        const modalContentContainer = document.querySelector('.brz-demo-modal-content');
        const successTemplate = document.getElementById('brz-demo-modal-content-success');

        if (!modalElement || !modalContentContainer || !successTemplate) {
            return;
        }

        modalContentContainer.innerHTML = successTemplate.innerHTML;
        modalElement.classList.add('brz-demo-show-modal');

        const modalTitle = modalContentContainer.querySelector('.brz-demo-modal-content-h3');
        const editButton = modalContentContainer.querySelector('.js-demo-data-edit-homepage');
        const modalDescription = modalContentContainer.querySelector('.brz-demo-modal-content-p');

        if (titleText) {
            if (modalTitle) {
                modalTitle.textContent = titleText;
            }
        }

        if (descriptionText) {
            if (modalDescription) {
                modalDescription.textContent = descriptionText;
            }
        }

        if (buttonText) {
            if (editButton) {
                editButton.textContent = buttonText;
            }
        }

        if (editUrl) {
            editButton.setAttribute('href', editUrl);
        }
    }

    function showErrorModal() {
        const modalElement = document.querySelector('.brz-demo-modal');
        const errorContentContainer = document.querySelector('.brz-demo-modal-content');
        const errorTemplate = document.getElementById('brz-demo-modal-content-error');

        if (!modalElement || !errorContentContainer || !errorTemplate) {
            return;
        }

        errorContentContainer.innerHTML = errorTemplate.innerHTML;
        modalElement.classList.add('brz-demo-show-modal');
    }

    function createSession(buttonElement) {
        loadingModal(
            Brizy_Admin_Data.l10n.aiCreatingSessionTitle,
            Brizy_Admin_Data.l10n.aiCreatingSessionDesc,
        );

        const ajaxData = {
            action: Brizy_Admin_Data.aiPrefix + Brizy_Admin_Data.aiActions.createSession,
            hash: Brizy_Admin_Data.aiNonce
        };

        fetch(Brizy_Admin_Data.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(ajaxData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                if (response && response.success) {
                    let aiUrl = response.data.aiUrl + '/wp-admin/admin.php?page=starter-templates';
                    successModal(
                        Brizy_Admin_Data.l10n.aiCreatingSessionSuccessTitle,
                        Brizy_Admin_Data.l10n.aiCreatingSessionSuccessDesc,
                        Brizy_Admin_Data.l10n.aiCreatingSessionSuccessBtn,
                        aiUrl,
                    );
                } else {
                    showErrorModal();
                }
            })
            .catch(error => {
                showErrorModal();
            })
            .finally(() => {
                if (buttonElement) {
                    buttonElement.disabled = false;
                }
            });
    }

    function generateTemplate(sessionId) {
        loadingModal(
            Brizy_Admin_Data.l10n.aiGenerateTemplateTitle,
            Brizy_Admin_Data.l10n.aiGenerateTemplateDesc,
        );

        const ajaxData = {
            action: Brizy_Admin_Data.aiPrefix + Brizy_Admin_Data.aiActions.generateTemplate,
            hash: Brizy_Admin_Data.aiNonce,
            sessionId: sessionId
        };

        fetch(Brizy_Admin_Data.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(ajaxData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                if (response && response.success) {
                    typeImportModal(response);
                } else {
                    showErrorModal();
                }
            })
            .catch(error => {
                showErrorModal();
            });
    }

    function typeImportModal(response) {
        const modalElement = document.querySelector('.brz-demo-modal');
        const modalContentContainer = document.querySelector('.brz-demo-modal-content');
        const installTemplate = document.getElementById('brz-demo-modal-content-install');

        if (modalContentContainer && installTemplate) {
            modalContentContainer.innerHTML = installTemplate.innerHTML;
            modalElement.classList.add('brz-demo-show-modal');

            const deleteBtn = modalContentContainer.querySelector('.js-demo-install[data-rm-content="1"]');
            const keepBtn = modalContentContainer.querySelector('.js-demo-install[data-rm-content="0"]');

            if (deleteBtn) {
                deleteBtn.dataset.response = JSON.stringify(response);
                deleteBtn.addEventListener('click', handleDeleteClick);
            }

            if (keepBtn) {
                keepBtn.dataset.response = JSON.stringify(response);
                keepBtn.addEventListener('click', handleKeepClick);
            }
        }
    }

    function handleDeleteClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const buttonElement = event.currentTarget;
        const responseString = buttonElement.dataset.response;
        const responseData = JSON.parse(responseString);

        loadingModal(
            null,
            null,
        );

        const ajaxData = {
            action: Brizy_Admin_Data.aiPrefix + Brizy_Admin_Data.aiActions.importDelete,
            hash: Brizy_Admin_Data.aiNonce,
            body: JSON.stringify(responseData.data)
        };

        fetch(Brizy_Admin_Data.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(ajaxData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                if (response && response.success) {
                    if (response.data) {
                        let editPageUrl = response.data.editPageUrl;
                        console.log(response);
                        successModal(
                            null,
                            null,
                            null,
                            editPageUrl,
                        );
                    } else {
                        console.log(response);
                        showErrorModal();
                    }
                } else {
                    showErrorModal();
                }
            })
            .catch(error => {
                showErrorModal();
            });
    }

    function handleKeepClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const buttonElement = event.currentTarget;
        const responseString = buttonElement.dataset.response;
        const responseData = JSON.parse(responseString);

        loadingModal(
            null,
            null,
        );

        const ajaxData = {
            action: Brizy_Admin_Data.aiPrefix + Brizy_Admin_Data.aiActions.importKeep,
            hash: Brizy_Admin_Data.aiNonce,
            body: JSON.stringify(responseData.data)
        };

        fetch(Brizy_Admin_Data.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(ajaxData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                if (response && response.success) {
                    if (response.data) {
                        let editPageUrl = response.data.editPageUrl;
                        console.log(response);
                        successModal(
                            null,
                            null,
                            null,
                            editPageUrl,
                        );
                    } else {
                        console.log(response);
                        showErrorModal();
                    }
                } else {
                    console.log(response);
                    showErrorModal();
                }
            })
            .catch(error => {
                console.log(error);
                showErrorModal();
            });
    }
});
