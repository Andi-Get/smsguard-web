# SMSGuard Web Dashboard

This repository contains the companion web application for **SMSGuard**, an offline-first Android app designed to help users find, alarm, and lock lost or stolen phones via SMS commands. 

The web dashboard serves as a management portal and a lost-and-found lookup system, bridging the gap between the mobile app and the web.

## ✨ Features

* **Home:** Introduces the SMSGuard ecosystem and its core offline security features.
* **Lost & Found Registry:** Allows owners to report a device as lost using its IMEI, model, and a contact method. Anyone can query the database to check the status of an IMEI.
* **Device Dashboard:** A centralized hub showing counts of registered, lost, and recovered devices. Users can easily mark a device as safe or lost.
* **Deep Linking:** Seamlessly opens the mobile app via Android intent deep links (`smsgward://`) for device pairing.
* **Setup Guide:** Step-by-step instructions for installing the Android app and utilizing the web portal.

## 🔗 Related Repositories
* **Android App:** [smsgward-org/smsgward](https://github.com/smsgward-org/smsgward)