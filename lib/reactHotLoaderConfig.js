"use strict";

var _reactHotLoader = require("react-hot-loader");

(0, _reactHotLoader.setConfig)({
  onComponentCreate: (type, name) => (String(type).indexOf("useState") > 0 || String(type).indexOf("useEffect") > 0) && (0, _reactHotLoader.cold)(type)
});