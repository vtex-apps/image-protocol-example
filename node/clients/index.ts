import { IOClients } from '@vtex/api'

import LogisticsClient from './logistics'
import Status from './status'
import CustomDataDataManager from './customDataManager'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get status() {
    return this.getOrSet('status', Status)
  }

  public get logistics() {
    return this.getOrSet('logistics', LogisticsClient)
  }

  public get customDataManager() {
    return this.getOrSet('customDataManager', CustomDataDataManager)
  }
}
