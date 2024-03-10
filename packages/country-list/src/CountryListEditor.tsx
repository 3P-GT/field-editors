import * as React from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';

import { FieldAPI, FieldConnector, LocalesAPI } from '@contentful/field-editor-shared';
import { FieldConnectorChildProps } from '@contentful/field-editor-shared';
import countries from 'i18n-iso-countries';
import countriesEn from 'i18n-iso-countries/langs/en.json';
import isEqual from 'lodash/isEqual';

countries.registerLocale(countriesEn);

const options = Object.keys(countries.getAlpha2Codes()).map((code) => ({
  value: code,
  label: countries.getName(code, 'en'),
}));

export interface CountryListEditorProps {
  /**
   * is the field disabled initially
   */
  isInitiallyDisabled: boolean;

  /**
   * sdk.field
   */
  field: FieldAPI;

  /**
   * sdk.locales
   */
  locales: LocalesAPI;
}

type CountryListValue = string[];

function isEmptyListValue(value: CountryListValue | null) {
  return value === null || value.length === 0;
}

export function CountryListEditor(props: CountryListEditorProps) {
  const { field, locales } = props;

  const direction = locales.direction[field.locale] || 'ltr';

  return (
    <FieldConnector<CountryListValue>
      debounce={0}
      isEmptyValue={isEmptyListValue}
      field={field}
      isInitiallyDisabled={props.isInitiallyDisabled}
    >
      {(childProps) => (
        <ListEditorInternal {...childProps} direction={direction} isRequired={field.required} />
      )}
    </FieldConnector>
  );
}

const countryCodesToOptions = (codes: string[]): { value: string; label: string }[] => {
  return codes.map((code) => ({
    value: code,
    label: countries.getName(code, 'en') ?? code,
  }));
};

function ListEditorInternal({
  setValue,
  value,
  disabled,
  direction,
  isRequired,
}: FieldConnectorChildProps<CountryListValue> & { direction: 'rtl' | 'ltr'; isRequired: boolean }) {
  // debugger;
  const [valueState, setValueState] = React.useState(() => countryCodesToOptions(value || []));

  const onChange = (
    selectedCountryOptions: MultiValue<{ value: string; label: string }>,
    _actionMeta: ActionMeta<any>
  ) => {
    const selectedCountryCodes = selectedCountryOptions.map((item) => item.value);
    const changed = !isEqual(selectedCountryCodes, value);
    if (changed) {
      setValue(selectedCountryCodes);
      setValueState(selectedCountryOptions);
    }
  };

  return (
    <Select
      onChange={onChange}
      required={isRequired}
      isDisabled={disabled}
      value={valueState}
      isRtl={direction === 'rtl'}
      isMulti={true}
      delimiter=","
      options={options}
    />
  );
}

CountryListEditor.defaultProps = {
  isInitiallyDisabled: true,
};
