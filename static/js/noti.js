let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        alert('알림 권한을 허용해 주세요.');
        return;
    }
}


function subscribeUser() {
    const applicationServerPublicKey = localStorage.getItem('applicationServerPublicKey');
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function (subscription) {
            localStorage.setItem('sub_token', JSON.stringify(subscription));
            isSubscribed = true;
            updateBtn();
        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch(function (error) {
            console.log('Error unsubscribing', error);
        })
        .then(function () {
            console.log('User is unsubscribed.');
            isSubscribed = false;
            updateBtn();
        });
}

function initializeUI() {
    if (isSubscribed) {
        unsubscribeUser();
    } else {
        subscribeUser();
    }

    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);
            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

            updateBtn();
        });
}

$.ajax({
    type: "GET",
    url: '/subscription/',
    success: function (response) {
        console.log("response", response);
        localStorage.setItem('applicationServerPublicKey', response.public_key);
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            console.log('Service Worker and Push is supported');
            navigator.serviceWorker.register(notiswurl)
                .then(function (swReg) {
                    console.log('Service Worker is registered', swReg);
                    swRegistration = swReg;
                    initializeUI();
                })
                .catch(function (error) {
                    console.error('Service Worker Error', error);
                });
        } else {
            console.warn('Push meapplicationServerPublicKeyssaging is not supported');
        }


        $.ajax({
            type: "POST",
            url: "/subscription/",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                'subscription_token': localStorage.getItem('sub_token'),
            }),
            success: function (data) {
                console.log("success", data);
            }
        });
    }
});



