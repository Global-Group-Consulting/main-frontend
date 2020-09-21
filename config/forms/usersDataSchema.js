export function basicData (context) {
  return [
    {
      cols: {
        'personType': {
          component: 'v-select',
          disabled: context.userCheckingData,
          items: context.$enums.PersonTypes,
          validations: {
            required: {}
          }
        }
      }
    },
    {
      if: context.personaGiuridica,
      cols: {
        'businessName': {},
        'vatNumber': {}
      }
    },
    {
      legend: context.personaGiuridica ? 'legal-representative' : '',
      cols: {
        'firstName': {
          validations: {
            required: {}
          }
        },
        'lastName': {
          validations: {
            required: {}
          }
        },
        'fiscalCode': {
          validations: {
            required: {}
          }
        },
        'gender': {
          component: 'v-select',
          items: context.$enums.Genders
        }
      }
    },
    {
      legend: (context.personaGiuridica ? 'legal-representative-' : '') + 'birth-date',
      cols: {
        'birthCountry': {
          component: 'v-select',
          items: 'enums.countriesList'
        },
        'birthProvince': {
          component: 'v-select',
          items: 'enums.provincesList',
          if: context.formData.birthCountry === 'IT'
        },
        'birthCity': {},
        'birthDate': {
          'component': 'date-picker',
          'initial-date': context.$moment().subtract(18, 'years').format('YYYY-MM-DD')
        }
      }
    },
    {
      legend: 'identity-docs',
      cols: {
        'docType': {
          component: 'v-select',
          items: context.$enums.DocumentTypes
        },
        'docNumber': {},
        'docExpiration': {
          'component': 'date-picker',
          'min': context.$moment().format('YYYY-MM-DD')
        }

      }
    }
  ]
}

export function addressData (context) {
  return [
    {
      if: context.personaGiuridica,
      cols: {
        'businessCountry': {
          component: 'v-select',
          items: 'enums.countries'
        },
        'businessRegion': {
          component: 'v-select',
          items: 'enums.regionsList',
          if: context.formData.businessCountry === 'IT'
        },
        'businessProvince': {
          component: 'v-select',
          items: 'enums.provincesList',
          if: context.formData.businessCountry === 'IT'
        },
        'businessCity': {},
        'businessZip': {},
        'businessAddress': {}
      }
    },
    {
      legend: (context.personaGiuridica ? `${context.personaGiuridica ? 'legal-representative-' : ''}` : '') + 'residence',
      cols: {
        'legalRepresentativeCountry': {
          component: 'v-select',
          items: 'enums.countriesList'
        },
        'legalRepresentativeRegion': {
          component: 'v-select',
          items: 'enums.regionsList',
          if: context.formData.legalRepresentativeCountry === 'IT'
        },
        'legalRepresentativeProvince': {
          component: 'v-select',
          items: 'enums.provincesList',
          if: context.formData.legalRepresentativeCountry === 'IT'
        },
        'legalRepresentativeCity': {},
        'legalRepresentativeZip': {},
        'legalRepresentativeAddress': {}
      }
    }
  ]

}

export function contactsData (context) {
  return [
    {
      legend: 'contacts',
      cols: {
        'email': {
          disabled: !!context.formData.contractNumber,
          validations: {
            required: {},
            email: {}
          }
        },
        'mobile': {},
        'phone': {}
      }
    }
  ]

}

export function contractData (context) {
  return [
    {
      cols: {
        'contractNumber': {
          disabled: true
        },
        'contractDate': {},
        'contractPercentage': {},
        'contractIban': {},
        'contractBic': {}
      }
    }
  ]
}

export function extraData (context) {
  return [
    {
      cols: {
        'role': {
          component: 'v-select',
          items: context.$enums.UserRoles
        },
        'referenceAgent': {
          if: context.showReferenceAgent
        }
      }
    },
    {
      if: !context.isNewUser,
      cols: {
        'accountCreatedAt': {
          readonly: true,
          formatter: 'dateHourFormatter'
        },
        'accountUpdatedAt': {
          readonly: true,
          formatter: 'dateHourFormatter'
        },
        'accountActivatedAt': {
          readonly: true,
          formatter: 'dateHourFormatter'
        },
        'accountVerifiedAt': {
          readonly: true,
          formatter: 'dateHourFormatter'
        },
      }
    }
  ]
}

export default function (context) {
  return [
    ...basicData(context),
    ...addressData(context),
    ...contactsData(context),
    ...contractData(context),
    ...extraData(context)
  ]
}
