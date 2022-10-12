function logMessage(level, textPayload, objectPayload) {
  let message = `[${level}] ${textPayload} ${
    objectPayload ? "\n" + JSON.stringify(objectPayload) : ""
  }`;
  console[level.toLowerCase()](message);
}

function debug(textPayload, objectPayload) {
  if (!objectPayload && typeof textPayload === "object") {
    logMessage("DEBUG", textPayload, textPayload);
    return;
  }
  logMessage("DEBUG", textPayload, objectPayload);
}

function info(textPayload, objectPayload) {
  if (!objectPayload && typeof textPayload === "object") {
    logMessage("INFO", textPayload, textPayload);
    return;
  }
  logMessage("INFO", textPayload, objectPayload);
}

function warn(textPayload, objectPayload) {
  if (!objectPayload && typeof textPayload === "object") {
    logMessage("WARN", textPayload, textPayload);
    return;
  }
  logMessage("WARN", textPayload, objectPayload);
}

function error(textPayload, objectPayload) {
  if (!objectPayload && typeof textPayload === "object") {
    logMessage("ERROR", textPayload, textPayload);
    return;
  }
  logMessage("ERROR", textPayload, objectPayload);
}

module.exports = { debug, info, warn, error };
