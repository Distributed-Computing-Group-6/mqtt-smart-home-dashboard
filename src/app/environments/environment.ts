export const environment = {
    production: false,
    encryptionKey: 'test-key-change-this-in-prod',
    mqttUrl: 'wss://t5c7dc17.ala.us-east-1.emqxsl.com:8084/mqtt',
    guestUser:{
      username: 'guest_user', 
      password: 'Fys9AiFHDpLzndn',
    },
    virtualDevices: [
    {
        "friendly_name": "Light",
        "ieee": "0vLight",
        "controls": [
            {
                "access": 7,
                "description": "On/off state of this light",
                "label": "State",
                "name": "state",
                "property": "state",
                "type": "binary",
                "value_off": "OFF",
                "value_on": "ON",
                "value_toggle": "TOGGLE"
            },
            {
                "access": 7,
                "description": "Brightness of this light",
                "label": "Brightness",
                "name": "brightness",
                "property": "brightness",
                "type": "numeric",
                "value_max": 254,
                "value_min": 0
            },
            {
                "access": 7,
                "description": "Color temperature of this light",
                "label": "Color temp",
                "name": "color_temp",
                "presets": [
                    {
                        "description": "Coolest temperature supported",
                        "name": "coolest",
                        "value": 153
                    },
                    {
                        "description": "Cool temperature (250 mireds / 4000 Kelvin)",
                        "name": "cool",
                        "value": 250
                    },
                    {
                        "description": "Neutral temperature (370 mireds / 2700 Kelvin)",
                        "name": "neutral",
                        "value": 370
                    },
                    {
                        "description": "Warmest temperature supported",
                        "name": "warmest",
                        "value": 370
                    }
                ],
                "property": "color_temp",
                "type": "numeric",
                "unit": "mired",
                "value_max": 370,
                "value_min": 153
            },
            {
                "access": 7,
                "description": "Color temperature after cold power on of this light",
                "label": "Color temp startup",
                "name": "color_temp_startup",
                "presets": [
                    {
                        "description": "Coolest temperature supported",
                        "name": "coolest",
                        "value": 153
                    },
                    {
                        "description": "Cool temperature (250 mireds / 4000 Kelvin)",
                        "name": "cool",
                        "value": 250
                    },
                    {
                        "description": "Neutral temperature (370 mireds / 2700 Kelvin)",
                        "name": "neutral",
                        "value": 370
                    },
                    {
                        "description": "Warmest temperature supported",
                        "name": "warmest",
                        "value": 370
                    },
                    {
                        "description": "Restore previous color_temp on cold power on",
                        "name": "previous",
                        "value": 65535
                    }
                ],
                "property": "color_temp_startup",
                "type": "numeric",
                "unit": "mired",
                "value_max": 370,
                "value_min": 153
            }
        ],
        "type": "light",
        "exposes": [
            {
                "features": [
                    {
                        "access": 7,
                        "description": "On/off state of this light",
                        "label": "State",
                        "name": "state",
                        "property": "state",
                        "type": "binary",
                        "value_off": "OFF",
                        "value_on": "ON",
                        "value_toggle": "TOGGLE"
                    },
                    {
                        "access": 7,
                        "description": "Brightness of this light",
                        "label": "Brightness",
                        "name": "brightness",
                        "property": "brightness",
                        "type": "numeric",
                        "value_max": 254,
                        "value_min": 0
                    },
                    {
                        "access": 7,
                        "description": "Color temperature of this light",
                        "label": "Color temp",
                        "name": "color_temp",
                        "presets": [
                            {
                                "description": "Coolest temperature supported",
                                "name": "coolest",
                                "value": 153
                            },
                            {
                                "description": "Cool temperature (250 mireds / 4000 Kelvin)",
                                "name": "cool",
                                "value": 250
                            },
                            {
                                "description": "Neutral temperature (370 mireds / 2700 Kelvin)",
                                "name": "neutral",
                                "value": 370
                            },
                            {
                                "description": "Warmest temperature supported",
                                "name": "warmest",
                                "value": 370
                            }
                        ],
                        "property": "color_temp",
                        "type": "numeric",
                        "unit": "mired",
                        "value_max": 370,
                        "value_min": 153
                    },
                    {
                        "access": 7,
                        "description": "Color temperature after cold power on of this light",
                        "label": "Color temp startup",
                        "name": "color_temp_startup",
                        "presets": [
                            {
                                "description": "Coolest temperature supported",
                                "name": "coolest",
                                "value": 153
                            },
                            {
                                "description": "Cool temperature (250 mireds / 4000 Kelvin)",
                                "name": "cool",
                                "value": 250
                            },
                            {
                                "description": "Neutral temperature (370 mireds / 2700 Kelvin)",
                                "name": "neutral",
                                "value": 370
                            },
                            {
                                "description": "Warmest temperature supported",
                                "name": "warmest",
                                "value": 370
                            },
                            {
                                "description": "Restore previous color_temp on cold power on",
                                "name": "previous",
                                "value": 65535
                            }
                        ],
                        "property": "color_temp_startup",
                        "type": "numeric",
                        "unit": "mired",
                        "value_max": 370,
                        "value_min": 153
                    }
                ],
                "type": "light"
            },
            {
                "access": 2,
                "description": "Triggers an effect on the light (e.g. make light blink for a few seconds)",
                "label": "Effect",
                "name": "effect",
                "property": "effect",
                "type": "enum",
                "values": [
                    "blink",
                    "breathe",
                    "okay",
                    "channel_change",
                    "finish_effect",
                    "stop_effect"
                ]
            },
            {
                "access": 7,
                "category": "config",
                "description": "Controls the behavior when the device is powered on after power loss",
                "label": "Power-on behavior",
                "name": "power_on_behavior",
                "property": "power_on_behavior",
                "type": "enum",
                "values": [
                    "off",
                    "on",
                    "toggle",
                    "previous"
                ]
            },
            {
                "access": 1,
                "category": "diagnostic",
                "description": "Link quality (signal strength)",
                "label": "Linkquality",
                "name": "linkquality",
                "property": "linkquality",
                "type": "numeric",
                "unit": "lqi",
                "value_max": 255,
                "value_min": 0
            }
        ]
    },
    {
        "friendly_name": "Switch",
        "ieee": "0vSwitch",
        "controls": [
            {
                "access": 7,
                "description": "On/off state of the switch",
                "label": "State",
                "name": "state",
                "property": "state",
                "type": "binary",
                "value_off": "OFF",
                "value_on": "ON",
                "value_toggle": "TOGGLE"
            }
        ],
        "type": "switch",
        "exposes": [
            {
                "features": [
                    {
                        "access": 7,
                        "description": "On/off state of the switch",
                        "label": "State",
                        "name": "state",
                        "property": "state",
                        "type": "binary",
                        "value_off": "OFF",
                        "value_on": "ON",
                        "value_toggle": "TOGGLE"
                    }
                ],
                "type": "switch"
            },
            {
                "access": 7,
                "category": "config",
                "description": "Controls the behavior when the device is powered on after power loss",
                "label": "Power-on behavior",
                "name": "power_on_behavior",
                "property": "power_on_behavior",
                "type": "enum",
                "values": [
                    "off",
                    "on",
                    "toggle",
                    "previous"
                ]
            },
            {
                "access": 2,
                "category": "config",
                "description": "Initiate device identification",
                "label": "Identify",
                "name": "identify",
                "property": "identify",
                "type": "enum",
                "values": [
                    "identify"
                ]
            },
            {
                "access": 1,
                "category": "diagnostic",
                "description": "Link quality (signal strength)",
                "label": "Linkquality",
                "name": "linkquality",
                "property": "linkquality",
                "type": "numeric",
                "unit": "lqi",
                "value_max": 255,
                "value_min": 0
            }
        ]
    },
    {
        "friendly_name": "Contact",
        "ieee": "0vContact",
        "controls": [
            {
                "access": 1,
                "description": "Indicates if the contact is closed (= true) or open (= false)",
                "label": "Contact",
                "name": "contact",
                "property": "contact",
                "type": "binary",
                "value_off": true,
                "value_on": false
            },
            {
                "access": 1,
                "description": "Indicates whether the device is tampered",
                "label": "Tamper",
                "name": "tamper",
                "property": "tamper",
                "type": "binary",
                "value_off": false,
                "value_on": true
            },
            {
                "access": 1,
                "description": "Measured temperature value",
                "label": "Temperature",
                "name": "temperature",
                "property": "temperature",
                "type": "numeric",
                "unit": "°C"
            }
        ],
        "type": "binary",
        "exposes": [
            {
                "access": 1,
                "category": "diagnostic",
                "description": "Indicates if the battery of this device is almost empty",
                "label": "Battery low",
                "name": "battery_low",
                "property": "battery_low",
                "type": "binary",
                "value_off": false,
                "value_on": true
            },
            {
                "access": 1,
                "category": "diagnostic",
                "description": "Remaining battery in %, can take up to 24 hours before reported",
                "label": "Battery",
                "name": "battery",
                "property": "battery",
                "type": "numeric",
                "unit": "%",
                "value_max": 100,
                "value_min": 0
            },
            {
                "access": 1,
                "category": "diagnostic",
                "description": "Link quality (signal strength)",
                "label": "Linkquality",
                "name": "linkquality",
                "property": "linkquality",
                "type": "numeric",
                "unit": "lqi",
                "value_max": 255,
                "value_min": 0
            }
        ]
    },
    {
        "friendly_name": "Cover",
        "ieee": "0vCover",
        "controls": [
            {
                "access": 3,
                "label": "State",
                "name": "state",
                "property": "state",
                "type": "enum",
                "values": [
                    "OPEN",
                    "CLOSE",
                    "STOP"
                ]
            },
            {
                "access": 7,
                "description": "Position of this cover",
                "label": "Position",
                "name": "position",
                "property": "position",
                "type": "numeric",
                "unit": "%",
                "value_max": 100,
                "value_min": 0
            }
        ],
        "type": "cover",
        "exposes": [
            {
                "features": [
                    {
                        "access": 3,
                        "label": "State",
                        "name": "state",
                        "property": "state",
                        "type": "enum",
                        "values": [
                            "OPEN",
                            "CLOSE",
                            "STOP"
                        ]
                    },
                    {
                        "access": 7,
                        "description": "Position of this cover",
                        "label": "Position",
                        "name": "position",
                        "property": "position",
                        "type": "numeric",
                        "unit": "%",
                        "value_max": 100,
                        "value_min": 0
                    }
                ],
                "type": "cover"
            },
            {
                "access": 2,
                "category": "config",
                "description": "Initiate device identification",
                "label": "Identify",
                "name": "identify",
                "property": "identify",
                "type": "enum",
                "values": [
                    "identify"
                ]
            },
            {
                "access": 5,
                "category": "diagnostic",
                "description": "Remaining battery in %",
                "label": "Battery",
                "name": "battery",
                "property": "battery",
                "type": "numeric",
                "unit": "%",
                "value_max": 100,
                "value_min": 0
            },
            {
                "access": 1,
                "category": "diagnostic",
                "description": "Link quality (signal strength)",
                "label": "Linkquality",
                "name": "linkquality",
                "property": "linkquality",
                "type": "numeric",
                "unit": "lqi",
                "value_max": 255,
                "value_min": 0
            }
        ]
    },
    {
      "friendly_name": "Color",
      "ieee": "0vColorLight",
      "controls": [
        {
          "access": 7,
          "description": "On/off state of this light",
          "label": "State",
          "name": "state",
          "property": "state",
          "type": "binary",
          "value_off": "OFF",
          "value_on": "ON",
          "value_toggle": "TOGGLE"
        },
        {
          "access": 7,
          "description": "Brightness of this light",
          "label": "Brightness",
          "name": "brightness",
          "property": "brightness",
          "type": "numeric",
          "value_max": 254,
          "value_min": 0
        },
        {
          "type": "composite",
          "name": "color_xy",
          "label": "Color xy",
          "access": 2,
          "property": "color",
          "features": [
            {
              "type": "numeric",
              "name": "x",
              "label": "X",
              "property": "x",
              "access": 7
            },
            {
              "type": "numeric",
              "name": "y",
              "label": "Y",
              "property": "y",
              "access": 7
            }
          ]
        },
        {
          "type": "composite",
          "name": "color_hs",
          "label": "Color HS",
          "access": 2,
          "property": "color",
          "features": [
            {
              "type": "numeric",
              "name": "hue",
              "label": "Hue",
              "property": "hue",
              "access": 7
            },
            {
              "type": "numeric",
              "name": "saturation",
              "label": "Saturation",
              "property": "saturation",
              "access": 7
            }
          ]
        }
      ],
      "type": "light"
    },
    {
      "friendly_name": "Text",
      "ieee": "0vtext",
      "controls": [
        {
          "type": "text",
          "name": "inserted",
          "label": "Inserted",
          "property": "inserted",
          "access": 1
        }
      ]
  },
  ]
}