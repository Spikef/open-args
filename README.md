# open-args

> Validate request arguments based on openAPI spec 2.0 (swagger 2.0).

## Install

```bash
$ npm i open-args
```

## Usage

```javascript
var Rav = require('open-args');

var method = 'patch';
var path = '/pets/{PetName}';
var spec = require('./spec');   // swagger json schema
var req = {
    header: {
        Authorization: 'token 123'
    },
    body: {
        Name: 'Dog',
        Type: 'cat',
        Age: 5,
        Address: {
            Street: 'HundredFlowersStreet',
            City: 'OneNightRiver',
            State: 'LS',
            ZipCode: 10001
        },
        Vet: {
            Name: 'Dr Green',
            LastTime: Date(),
            Address: {
                Street: 'HundredFlowersStreet',
                City: 'OneNightRiver',
                State: 'LS',
                ZipCode: 10001
            }
        },
        huntingSkill: 'adventurous'
    },
    params: {
        PetName: 'Dog'
    }
};

var rav = new Rav(spec);
var key = rav.hashKey(method, path);

console.log(rav.validate(key, req));

// returns true or { code, message }
```
