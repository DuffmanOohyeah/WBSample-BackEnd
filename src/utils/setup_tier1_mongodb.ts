'use strict';

export{};
const mongoUtils: any = require('./mongodb');
const config: any = require('../config/index').data;
//const moment: any = require('moment');


const doSetup: any = async (req: any, res: any) => {
  const rtnObj: any = {};
  try{
    let dbName: string = 'tier1';
    const client: any = await mongoUtils.connect(dbName);
    const db: any = await mongoUtils.getDb(client, dbName);
      let popTitles: boolean = await exports.populateTitles(db);
      let popRoles: boolean = await exports.populateRoles(db);
      let popCountries: boolean = await exports.populateCountries(db);
      let popSettings: boolean = await exports.populateSettings(db);
      let popUsers: boolean = await exports.populateUsers(db);
      let popClients: boolean = await exports.populateClients(db);
    await mongoUtils.close(client);

    rtnObj['titles_populated'] = popTitles;
    rtnObj['roles_populated'] = popRoles;
    rtnObj['countries_populated'] = popCountries;
    rtnObj['settings_populated'] = popSettings;
    rtnObj['users_populated'] = popUsers;
    rtnObj['clients_populated'] = popClients;

    req.statusCode = 200;
  }catch( err: any ){
    rtnObj.err = err.message;
    req.statusCode = 400;
  }
  return rtnObj;
};


const populateTitles: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('titles');
    const arr: any[] = await collection.find({}).toArray();
    if( !arr.length ){
      const insert: any = await collection.insertMany([
        {title: 'Dr.'},
        {title: 'Mr.'},
        {title: 'Mrs.'},
        {title: 'Ms.'},
        {title: 'Jr.'},
        {title: 'Other'}
      ]);
      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }
  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


const populateRoles: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('roles');
    const arr: any[] = await collection.find({}).toArray();
    if( !arr.length ){
      const insert: any = await collection.insertMany([
        {role: 'SuperAdmin'},
        {role: 'Admin'},
        {role: 'Reports'},
        {role: 'Editor'},
        {role: 'Moderator'},
        {role: 'Guest'}
      ]);
      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }
  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


const populateCountries: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('countries');
    const arr: any[] = await collection.find({}).toArray();
    if( !arr.length ){
      const insert: any = await collection.insertMany([
        {iso_code: 'AF', country: 'Afghanistan'},
        {iso_code: 'AX', country: 'Aland Islands'},
        {iso_code: 'AL', country: 'Albania'},
        {iso_code: 'DZ', country: 'Algeria'},
        {iso_code: 'AS', country: 'American Samoa'},
        {iso_code: 'AD', country: 'Andorra'},
        {iso_code: 'AO', country: 'Angola'},
        {iso_code: 'AI', country: 'Anguilla'},
        {iso_code: 'AQ', country: 'Antarctica'},
        {iso_code: 'AG', country: 'Antigua And Barbuda'},
        {iso_code: 'AR', country: 'Argentina'},
        {iso_code: 'AM', country: 'Armenia'},
        {iso_code: 'AW', country: 'Aruba'},
        {iso_code: 'AU', country: 'Australia'},
        {iso_code: 'AT', country: 'Austria'},
        {iso_code: 'AZ', country: 'Azerbaijan'},
        {iso_code: 'BS', country: 'Bahamas'},
        {iso_code: 'BH', country: 'Bahrain'},
        {iso_code: 'BD', country: 'Bangladesh'},
        {iso_code: 'BB', country: 'Barbados'},
        {iso_code: 'BY', country: 'Belarus'},
        {iso_code: 'BE', country: 'Belgium'},
        {iso_code: 'BZ', country: 'Belize'},
        {iso_code: 'BJ', country: 'Benin'},
        {iso_code: 'BM', country: 'Bermuda'},
        {iso_code: 'BT', country: 'Bhutan'},
        {iso_code: 'BO', country: 'Bolivia'},
        {iso_code: 'BA', country: 'Bosnia And Herzegovina'},
        {iso_code: 'BW', country: 'Botswana'},
        {iso_code: 'BV', country: 'Bouvet Island'},
        {iso_code: 'BR', country: 'Brazil'},
        {iso_code: 'IO', country: 'British Indian Ocean Territory'},
        {iso_code: 'BN', country: 'Brunei Darussalam'},
        {iso_code: 'BG', country: 'Bulgaria'},
        {iso_code: 'BF', country: 'Burkina Faso'},
        {iso_code: 'BI', country: 'Burundi'},
        {iso_code: 'KH', country: 'Cambodia'},
        {iso_code: 'CM', country: 'Cameroon'},
        {iso_code: 'CA', country: 'Canada'},
        {iso_code: 'CV', country: 'Cape Verde'},
        {iso_code: 'KY', country: 'Cayman Islands'},
        {iso_code: 'CF', country: 'Central African Republic'},
        {iso_code: 'TD', country: 'Chad'},
        {iso_code: 'CL', country: 'Chile'},
        {iso_code: 'CN', country: 'China'},
        {iso_code: 'CX', country: 'Christmas Island'},
        {iso_code: 'CC', country: 'Cocos (Keeling) Islands'},
        {iso_code: 'CO', country: 'Colombia'},
        {iso_code: 'KM', country: 'Comoros'},
        {iso_code: 'CG', country: 'Congo'},
        {iso_code: 'CD', country: 'Congo, Democratic Republic'},
        {iso_code: 'CK', country: 'Cook Islands'},
        {iso_code: 'CR', country: 'Costa Rica'},
        {iso_code: 'CI', country: 'Cote D\'Ivoire'},
        {iso_code: 'HR', country: 'Croatia'},
        {iso_code: 'CU', country: 'Cuba'},
        {iso_code: 'CY', country: 'Cyprus'},
        {iso_code: 'CZ', country: 'Czech Republic'},
        {iso_code: 'DK', country: 'Denmark'},
        {iso_code: 'DJ', country: 'Djibouti'},
        {iso_code: 'DM', country: 'Dominica'},
        {iso_code: 'DO', country: 'Dominican Republic'},
        {iso_code: 'EC', country: 'Ecuador'},
        {iso_code: 'EG', country: 'Egypt'},
        {iso_code: 'SV', country: 'El Salvador'},
        {iso_code: 'GQ', country: 'Equatorial Guinea'},
        {iso_code: 'ER', country: 'Eritrea'},
        {iso_code: 'EE', country: 'Estonia'},
        {iso_code: 'ET', country: 'Ethiopia'},
        {iso_code: 'FK', country: 'Falkland Islands (Malvinas)'},
        {iso_code: 'FO', country: 'Faroe Islands'},
        {iso_code: 'FJ', country: 'Fiji'},
        {iso_code: 'FI', country: 'Finland'},
        {iso_code: 'FR', country: 'France'},
        {iso_code: 'GF', country: 'French Guiana'},
        {iso_code: 'PF', country: 'French Polynesia'},
        {iso_code: 'TF', country: 'French Southern Territories'},
        {iso_code: 'GA', country: 'Gabon'},
        {iso_code: 'GM', country: 'Gambia'},
        {iso_code: 'GE', country: 'Georgia'},
        {iso_code: 'DE', country: 'Germany'},
        {iso_code: 'GH', country: 'Ghana'},
        {iso_code: 'GI', country: 'Gibraltar'},
        {iso_code: 'GR', country: 'Greece'},
        {iso_code: 'GL', country: 'Greenland'},
        {iso_code: 'GD', country: 'Grenada'},
        {iso_code: 'GP', country: 'Guadeloupe'},
        {iso_code: 'GU', country: 'Guam'},
        {iso_code: 'GT', country: 'Guatemala'},
        {iso_code: 'GG', country: 'Guernsey'},
        {iso_code: 'GN', country: 'Guinea'},
        {iso_code: 'GW', country: 'Guinea-Bissau'},
        {iso_code: 'GY', country: 'Guyana'},
        {iso_code: 'HT', country: 'Haiti'},
        {iso_code: 'HM', country: 'Heard Island & Mcdonald Islands'},
        {iso_code: 'VA', country: 'Holy See (Vatican City State)'},
        {iso_code: 'HN', country: 'Honduras'},
        {iso_code: 'HK', country: 'Hong Kong'},
        {iso_code: 'HU', country: 'Hungary'},
        {iso_code: 'IS', country: 'Iceland'},
        {iso_code: 'IN', country: 'India'},
        {iso_code: 'ID', country: 'Indonesia'},
        {iso_code: 'IR', country: 'Iran, Islamic Republic Of'},
        {iso_code: 'IQ', country: 'Iraq'},
        {iso_code: 'IE', country: 'Ireland'},
        {iso_code: 'IM', country: 'Isle Of Man'},
        {iso_code: 'IL', country: 'Israel'},
        {iso_code: 'IT', country: 'Italy'},
        {iso_code: 'JM', country: 'Jamaica'},
        {iso_code: 'JP', country: 'Japan'},
        {iso_code: 'JE', country: 'Jersey'},
        {iso_code: 'JO', country: 'Jordan'},
        {iso_code: 'KZ', country: 'Kazakhstan'},
        {iso_code: 'KE', country: 'Kenya'},
        {iso_code: 'KI', country: 'Kiribati'},
        {iso_code: 'KR', country: 'Korea'},
        {iso_code: 'KW', country: 'Kuwait'},
        {iso_code: 'KG', country: 'Kyrgyzstan'},
        {iso_code: 'LA', country: 'Lao People\'s Democratic Republic'},
        {iso_code: 'LV', country: 'Latvia'},
        {iso_code: 'LB', country: 'Lebanon'},
        {iso_code: 'LS', country: 'Lesotho'},
        {iso_code: 'LR', country: 'Liberia'},
        {iso_code: 'LY', country: 'Libyan Arab Jamahiriya'},
        {iso_code: 'LI', country: 'Liechtenstein'},
        {iso_code: 'LT', country: 'Lithuania'},
        {iso_code: 'LU', country: 'Luxembourg'},
        {iso_code: 'MO', country: 'Macao'},
        {iso_code: 'MK', country: 'Macedonia'},
        {iso_code: 'MG', country: 'Madagascar'},
        {iso_code: 'MW', country: 'Malawi'},
        {iso_code: 'MY', country: 'Malaysia'},
        {iso_code: 'MV', country: 'Maldives'},
        {iso_code: 'ML', country: 'Mali'},
        {iso_code: 'MT', country: 'Malta'},
        {iso_code: 'MH', country: 'Marshall Islands'},
        {iso_code: 'MQ', country: 'Martinique'},
        {iso_code: 'MR', country: 'Mauritania'},
        {iso_code: 'MU', country: 'Mauritius'},
        {iso_code: 'YT', country: 'Mayotte'},
        {iso_code: 'MX', country: 'Mexico'},
        {iso_code: 'FM', country: 'Micronesia, Federated States Of'},
        {iso_code: 'MD', country: 'Moldova'},
        {iso_code: 'MC', country: 'Monaco'},
        {iso_code: 'MN', country: 'Mongolia'},
        {iso_code: 'ME', country: 'Montenegro'},
        {iso_code: 'MS', country: 'Montserrat'},
        {iso_code: 'MA', country: 'Morocco'},
        {iso_code: 'MZ', country: 'Mozambique'},
        {iso_code: 'MM', country: 'Myanmar'},
        {iso_code: 'NA', country: 'Namibia'},
        {iso_code: 'NR', country: 'Nauru'},
        {iso_code: 'NP', country: 'Nepal'},
        {iso_code: 'NL', country: 'Netherlands'},
        {iso_code: 'AN', country: 'Netherlands Antilles'},
        {iso_code: 'NC', country: 'New Caledonia'},
        {iso_code: 'NZ', country: 'New Zealand'},
        {iso_code: 'NI', country: 'Nicaragua'},
        {iso_code: 'NE', country: 'Niger'},
        {iso_code: 'NG', country: 'Nigeria'},
        {iso_code: 'NU', country: 'Niue'},
        {iso_code: 'NF', country: 'Norfolk Island'},
        {iso_code: 'MP', country: 'Northern Mariana Islands'},
        {iso_code: 'NO', country: 'Norway'},
        {iso_code: 'OM', country: 'Oman'},
        {iso_code: 'PK', country: 'Pakistan'},
        {iso_code: 'PW', country: 'Palau'},
        {iso_code: 'PS', country: 'Palestinian Territory, Occupied'},
        {iso_code: 'PA', country: 'Panama'},
        {iso_code: 'PG', country: 'Papua New Guinea'},
        {iso_code: 'PY', country: 'Paraguay'},
        {iso_code: 'PE', country: 'Peru'},
        {iso_code: 'PH', country: 'Philippines'},
        {iso_code: 'PN', country: 'Pitcairn'},
        {iso_code: 'PL', country: 'Poland'},
        {iso_code: 'PT', country: 'Portugal'},
        {iso_code: 'PR', country: 'Puerto Rico'},
        {iso_code: 'QA', country: 'Qatar'},
        {iso_code: 'RE', country: 'Reunion'},
        {iso_code: 'RO', country: 'Romania'},
        {iso_code: 'RU', country: 'Russian Federation'},
        {iso_code: 'RW', country: 'Rwanda'},
        {iso_code: 'BL', country: 'Saint Barthelemy'},
        {iso_code: 'SH', country: 'Saint Helena'},
        {iso_code: 'KN', country: 'Saint Kitts And Nevis'},
        {iso_code: 'LC', country: 'Saint Lucia'},
        {iso_code: 'MF', country: 'Saint Martin'},
        {iso_code: 'PM', country: 'Saint Pierre And Miquelon'},
        {iso_code: 'VC', country: 'Saint Vincent And Grenadines'},
        {iso_code: 'WS', country: 'Samoa'},
        {iso_code: 'SM', country: 'San Marino'},
        {iso_code: 'ST', country: 'Sao Tome And Principe'},
        {iso_code: 'SA', country: 'Saudi Arabia'},
        {iso_code: 'SN', country: 'Senegal'},
        {iso_code: 'RS', country: 'Serbia'},
        {iso_code: 'SC', country: 'Seychelles'},
        {iso_code: 'SL', country: 'Sierra Leone'},
        {iso_code: 'SG', country: 'Singapore'},
        {iso_code: 'SK', country: 'Slovakia'},
        {iso_code: 'SI', country: 'Slovenia'},
        {iso_code: 'SB', country: 'Solomon Islands'},
        {iso_code: 'SO', country: 'Somalia'},
        {iso_code: 'ZA', country: 'South Africa'},
        {iso_code: 'GS', country: 'South Georgia And Sandwich Isl.'},
        {iso_code: 'ES', country: 'Spain'},
        {iso_code: 'LK', country: 'Sri Lanka'},
        {iso_code: 'SD', country: 'Sudan'},
        {iso_code: 'SR', country: 'Suriname'},
        {iso_code: 'SJ', country: 'Svalbard And Jan Mayen'},
        {iso_code: 'SZ', country: 'Swaziland'},
        {iso_code: 'SE', country: 'Sweden'},
        {iso_code: 'CH', country: 'Switzerland'},
        {iso_code: 'SY', country: 'Syrian Arab Republic'},
        {iso_code: 'TW', country: 'Taiwan'},
        {iso_code: 'TJ', country: 'Tajikistan'},
        {iso_code: 'TZ', country: 'Tanzania'},
        {iso_code: 'TH', country: 'Thailand'},
        {iso_code: 'TL', country: 'Timor-Leste'},
        {iso_code: 'TG', country: 'Togo'},
        {iso_code: 'TK', country: 'Tokelau'},
        {iso_code: 'TO', country: 'Tonga'},
        {iso_code: 'TT', country: 'Trinidad And Tobago'},
        {iso_code: 'TN', country: 'Tunisia'},
        {iso_code: 'TR', country: 'Turkey'},
        {iso_code: 'TM', country: 'Turkmenistan'},
        {iso_code: 'TC', country: 'Turks And Caicos Islands'},
        {iso_code: 'TV', country: 'Tuvalu'},
        {iso_code: 'UG', country: 'Uganda'},
        {iso_code: 'UA', country: 'Ukraine'},
        {iso_code: 'AE', country: 'United Arab Emirates'},
        {iso_code: 'GB', country: 'United Kingdom'},
        {iso_code: 'US', country: 'United States of America'},
        {iso_code: 'UM', country: 'United States Outlying Islands'},
        {iso_code: 'UY', country: 'Uruguay'},
        {iso_code: 'UZ', country: 'Uzbekistan'},
        {iso_code: 'VU', country: 'Vanuatu'},
        {iso_code: 'VE', country: 'Venezuela'},
        {iso_code: 'VN', country: 'Vietnam'},
        {iso_code: 'VG', country: 'Virgin Islands, British'},
        {iso_code: 'VI', country: 'Virgin Islands, U.S.'},
        {iso_code: 'WF', country: 'Wallis And Futuna'},
        {iso_code: 'EH', country: 'Western Sahara'},
        {iso_code: 'YE', country: 'Yemen'},
        {iso_code: 'ZM', country: 'Zambia'},
        {iso_code: 'ZW', country: 'Zimbabwe'}
      ]);
      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }
  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


const populateSettings: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('settings');
    const arr: any[] = await collection.find({}).toArray();
    if( !arr.length ){
      const insert: any = await collection.insertMany([
        {setting: 'app_name', value: config.appVars.appName},
        {setting: 'chat_name', value: config.appVars.chatName},
        {setting: 'wbsample_company_name', value: config.appVars.wbSampleCompanyName},
        {setting: 'wbsample_from_email', value: config.appVars.wbSampleFromEmail}
      ]);
      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }
  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


const populateUsers: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('users');
    const arr: any[] = await collection.find({}).toArray();
    if( !arr.length ){
      const getTitle: any[] = await db.collection('titles')
        .find({title: 'Mr.'})
        .limit(1)
        .toArray();
      const insert: any = await collection.insertOne({
        title_id: (getTitle[0]._id || ''),
        first_name: 'Wendell',
        last_name: 'Boom',
        email: 'wendell@wbSample.live',
        password_hash: '$2a$10$FzXZhi/vZYFhf2g0YAdQ1e3le1i1fVkHYy/Fwi65SIwW9UHgwUgou',
        email_validated: true,
        validation_date: new Date(),
        job_title: 'Software Developer',
        last_login_date: '',
        account_suspended: false,
        suspended_reason: '',
        client_ids: []
      });
      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }
  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


const populateClients: any = async (db: any) => {
  let rtnBln: boolean = false;
  try{
    const collection: any = await db.collection('clients');
    const arr: any[] = await collection.find({}).toArray();
    if( !arr.length ){
      const insert: any = await collection.insertOne({
        full_name: 'Fox Interactive Inc.',
        friendly_name: 'FII',
        clientdb_instance: '',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        county: '',
        country: 'USA',
        logo: '',
        join_date: new Date(),
        archived: true,
        archived_date: new Date(),
        primary_contact: 'Boss of FII',
        contact_email: 'boss@foxinteractive.com',
        contact_phone: '012.3456.7890',
        account_manager: 'Someone at WBSample'
      });
      if( insert.result && insert.result.ok ){
        rtnBln = true;
      }
    }
  }catch( err: any ){
    console.log('err:', err.message);
  }
  return rtnBln;
};


exports = module.exports = {
  doSetup: doSetup,
  populateTitles: populateTitles,
  populateRoles: populateRoles,
  populateCountries: populateCountries,
  populateSettings: populateSettings,
  populateUsers: populateUsers,
  populateClients: populateClients
};
