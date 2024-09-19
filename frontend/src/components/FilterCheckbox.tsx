import React from 'react';
import { Checkbox } from '@mantine/core';

function FilterCheckbox(props: { label: string }) {
  // 체크 여부 상태를 관리하는 상태 변수
    const [checked, setChecked] = React.useState(false);
    const { label } = props;

    return (
      <Checkbox

        color="black.0" 
        label={label}
        checked={checked}
        onChange={() => setChecked(!checked)}
        // overrides 속성을 사용하여 스타일을 재정의
        styles={{
          label: {
            color: checked ? 'white' : 'black', // 체크 여부에 따라 색상 변경
            fontSize: 20,
          },
          inner: {
            input: {
              border: '2px solid black',
              backgroundColor: 'transparent',
              borderRadius: 2

            }
            
          }
        }}
      >
      </Checkbox>
    );
}

export default FilterCheckbox;
