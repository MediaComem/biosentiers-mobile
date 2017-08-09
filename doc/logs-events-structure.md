# Logs events structure

## Logs objects

The log objects are send to the backend and each represent an event in the app.
Their structure is as follow:

```json
{
  "occurredAt": "A string representing the moment of the event, in ISO format",
  "type": "The type of the event (see below)",
  "version": "The version of the structure on which this log is based",
  "properties": "An object whose properties vary depending on the type of the log (see below)"
}
```

## Event types

### Lifecycle events

#### `lifecycle.app.started`

> Fired each time the user starts the BioSentiers app.

**Properties object:**

```json
{}
```
#### `lifecycle.app.paused`

> Fired each time the user put the BioSentiers app in the background.

**Properties object:**

```json
{}
```

#### `lifecycle.app.resumed`

> Fired each time the user resumes the BioSentiers app from the background.

**Properties object:**

```json
{}
```

### Network events

#### `network.offline`

> Fired each time the device loses network connectivity

**Properties object:**

```json
{}
```

#### `network.online`

> Fired each time the device gain or has network connectivity

**Properties object:**

```json
{
  "connectionType": "The type of the network connectivity at the moment the event is fired."
}
```