'use strict';

cfg = angular.module 'services.config', []
cfg.constant 'configuration',
  apiRootUri: '@@apiUri'

