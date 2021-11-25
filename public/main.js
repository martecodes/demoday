const heart = document.getElementsByClassName("heart");
const unHeart = document.getElementsByClassName("unHeart");

Array.from(unHeart).forEach(function (element) {
    element.addEventListener('click', function () {
        const routeName = this.parentNode.childNodes[1].innerText

        fetch('/routeLikes', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                routeName: routeName
            })
        })
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                console.log(data)
                window.location.reload(true)
            })
    });
});

Array.from(heart).forEach(function (element) {
    element.addEventListener('click', function () {
        const routeName = this.parentNode.childNodes[1].innerText

        fetch('/routeUnLikes', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                routeName: routeName
            })
        })
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                console.log(data)
                window.location.reload(true)
            })
    });
});
