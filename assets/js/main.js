function splashScreen() {

    Swal.fire({
        title: 'Lysandra',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Play Game',
        text: 'Match Game',
        imageUrl: 'assets/images/logo.svg',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Open Source Match Game',
      }).then((result) => {
        //if (result.value) {
            Game.start();
            var context = new AudioContext();
            Game.playMusic('bensound-epic');
            Game.pauseMusic();
            Game.getSettings();
        //}
      })
}

window.onload = function () {
    splashScreen();
    //var context = new AudioContext();
};