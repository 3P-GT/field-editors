import * as React from 'react';

import { TextInput } from '@contentful/f36-components';
import { FieldAPI, FieldConnector, LocalesAPI } from '@contentful/field-editor-shared';
import { FieldConnectorChildProps } from '@contentful/field-editor-shared';
import isEqual from 'lodash/isEqual';

import * as styles from './styles';

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

function ListEditorInternal({
  setValue,
  value,
  errors,
  disabled,
  direction,
  isRequired,
}: FieldConnectorChildProps<CountryListValue> & { direction: 'rtl' | 'ltr'; isRequired: boolean }) {
  const [valueState, setValueState] = React.useState(() => (value || []).join(', '));

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueAsArray = e.target.value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
    const changed = !isEqual(valueAsArray, value);
    setValue(valueAsArray);

    const valueAsString = valueAsArray.join(', ');
    setValueState(changed ? valueAsString : e.target.value);
  };

  return (
    <TextInput
      testId="country-list-editor-input"
      className={direction === 'rtl' ? styles.rightToLeft : ''}
      isRequired={isRequired}
      isInvalid={errors.length > 0}
      isDisabled={disabled}
      value={valueState}
      onChange={onChange}
    />
  );
}

CountryListEditor.defaultProps = {
  isInitiallyDisabled: true,
};
