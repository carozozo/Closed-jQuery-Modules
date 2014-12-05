$(function () {
    var dBody = $('body');

    dBody.find('img').css('position', 'absolute');

    var dMsg = $('#msg');
    var dSaucerman = $('#saucerman');
    var dSaucermanShadow = $('#saucermanShadow');
    var dSpaceship = $('#spaceship');
    var dSpaceshipShadow = $('#spaceshipShadow');
    var dBuilding1 = $('#building1');
    var dBuilding2 = $('#building2');
    var dBg = $('bg');

    var msgY = 120;
    var saucermanY = 120;
    var saucermanShadowY = 100 + dSaucerman.height();
    var spaceshipY = 180;
    var spaceshipShadowY = 140 + dSpaceship.height();
    var building1Y = 100;
    var building2Y = 120;

    var msgZ = 6;
    var saucermanZ = 6;
    var saucermanShadowZ = 5;
    var spaceshipZ = 4;
    var spaceshipShadowZ = 3;
    var building1Z = 2;
    var building2Z = 1;
    var dBgZ = 0;

    dMsg.css('left', getMsgX());
    dMsg.css('top', msgY);
    dMsg.css('z-index', msgZ);

    dSaucerman.css('left', getSaucermanX());
    dSaucerman.css('top', saucermanY);
    dSaucerman.css('z-index', saucermanZ);

    dSaucermanShadow.css('left', getSaucermanX());
    dSaucermanShadow.css('top', saucermanShadowY);
    dSaucermanShadow.css('z-index', saucermanShadowZ);

    dSpaceship.css('left', getSpaceshipX());
    dSpaceship.css('top', spaceshipY);
    dSpaceship.css('z-index', spaceshipZ);

    dSpaceshipShadow.css('left', getSpaceshipX());
    dSpaceshipShadow.css('top', spaceshipShadowY);
    dSpaceshipShadow.css('z-index', spaceshipShadowZ);

    dBuilding1.css('left', getBuilding1X());
    dBuilding1.css('top', building1Y);
    dBuilding1.css('z-index', building1Z);

    dBuilding2.css('left', getBuilding2X());
    dBuilding2.css('top', building2Y);
    dBuilding2.css('z-index', building2Z);

    dBg.css('z-index', dBgZ);

    $(window).on('resize', function () {
        dBuilding1.css('left', getBuilding1X());
        dBuilding2.css('left', getBuilding2X());
    });

    $(document).on('mousemove', function (e) {
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        dMsg.css('margin-left', (dMsg.position().left - mouseX) / 30);
        dMsg.css('margin-top', (dMsg.position().top - mouseY) / 30);
        dSaucerman.css('margin-left', (dSaucerman.position().left - mouseX) / 30);
        dSaucerman.css('margin-top', (dSaucerman.position().top - mouseY) / 30);
        dSaucermanShadow.css('margin-left', (dSaucermanShadow.position().left - mouseX) / 30);
        dSaucermanShadow.css('margin-top', (dSaucermanShadow.position().top - mouseY) / 30);
        dSpaceship.css('margin-left', (dSpaceship.position().left - mouseX) / 40);
        dSpaceship.css('margin-top', (dSpaceship.position().top - mouseY) / 40);
        dSpaceshipShadow.css('margin-left', (dSpaceshipShadow.position().left - mouseX) / 40);
        dSpaceshipShadow.css('margin-top', (dSpaceshipShadow.position().top - mouseY) / 40);
        dBuilding1.css('margin-left', (dBuilding1.position().left + mouseX) / 60);
        dBuilding1.css('margin-top', (dBuilding1.position().top + mouseY) / 60);
        dBuilding2.css('margin-left', (dBuilding2.position().left + mouseX) / 30);
        dBuilding2.css('margin-top', (dBuilding2.position().top + mouseY) / 30);
    });

    function getMsgX() {
        var bodyWidth = dBody.width();
        return  bodyWidth / 2 - 420;
    }

    function getSaucermanX() {
        var bodyWidth = dBody.width();
        return  bodyWidth / 2 - 150;
    }

    function getSpaceshipX() {
        var bodyWidth = dBody.width();
        return  bodyWidth / 2 - 80;
    }

    function getBuilding1X() {
        var bodyWidth = dBody.width();
        return  bodyWidth / 2 + 30;
    }

    function getBuilding2X() {
        var bodyWidth = dBody.width();
        return  bodyWidth / 2 + 250;
    }
});