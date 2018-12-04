import { setConfig, cold } from "react-hot-loader";

setConfig({
  onComponentCreate: (type, name) =>
    (String(type).indexOf("useState") > 0 ||
      String(type).indexOf("useEffect") > 0) &&
    cold(type)
});
