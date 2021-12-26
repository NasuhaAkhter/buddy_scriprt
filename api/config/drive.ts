

/**
 * Config source: https://git.io/JBt3o
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

 import Env from '@ioc:Adonis/Core/Env'
 import { DriveConfig } from '@ioc:Adonis/Core/Drive'
 import Application from '@ioc:Adonis/Core/Application'

 /*
 |--------------------------------------------------------------------------
 | Drive Config
 |--------------------------------------------------------------------------
 |
 | The `DriveConfig` relies on the `DisksList` interface which is
 | defined inside the `contracts` directory.
 |
 */

const driveConfig: DriveConfig = {
    disk: Env.get('DRIVE_DISK'),
  
    disks: {
      local: {
        driver: 'local',
        visibility: 'public',
        root: Application.tmpPath('uploads'),
        basePath: '/var/www',
        serveFiles : true
      },
  
    //   s3: {
    //     driver: 's3',
    //     visibility: 'public',
    //     key: Env.get('S3_KEY'),
    //     secret: Env.get('S3_SECRET'),
    //     region: Env.get('S3_REGION'),
    //     bucket: Env.get('S3_BUCKET'),
    //     endpoint: Env.get('S3_ENDPOINT'),
    //   },
    },
  }
  
  export default driveConfig