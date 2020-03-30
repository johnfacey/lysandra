function splashScreen() {

    Swal.fire({
        title: 'Lysandra',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Start',
        text: 'Match Game',
        imageUrl: 'assets/images/logo.svg',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Open Source Match Game',
      }).then((result) => {
        if (result.value) {
            Game.start();
        }
      })
}

window.onload = function () {
    splashScreen();
};