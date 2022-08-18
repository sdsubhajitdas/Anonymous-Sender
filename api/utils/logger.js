function logMessage(level, textPayload, objectPayload) {
  let message = `[${level}] ${textPayload} ${
    objectPayload ? "\n" + JSON.stringify(objectPayload) : ""
  }`;
  console[level.toLowerCase()](message);
}

function debug(textPayload, objectPayload) {
  logMessage("DEBUG", textPayload, objectPayload);
}

function info(textPayload, objectPayload) {
  logMessage("INFO", textPayload, objectPayload);
}

function warn(textPayload, objectPayload) {
  logMessage("WARN", textPayload, objectPayload);
}

function error(textPayload, objectPayload) {
  logMessage("ERROR", textPayload, objectPayload);
}

module.exports = { debug, info, warn, error };
