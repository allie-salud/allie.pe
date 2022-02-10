let continuePersonalData = document.getElementById("continue-personal-data");
continuePersonalData.onclick = function() {
  window.dataLayer.push({
      "virtual":{
          "page":"/datos-personales"
      },
      "event":"trackVirtual"
  });
};
