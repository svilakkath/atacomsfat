// import React, {useMemo, useReducer} from 'react';
// import {Button, Text, TextInput, View} from 'react-native';

// type formState = {
//   userName: string;
//   password: string;
// };

// type formActions = {
//   type: string;
//   name: string;
//   value: string;
// };
// const formReducer = (state: formState, action: formActions) => {
//   switch (action.type) {
//     case 'SET_INPUT':
//       return {...state, [action.name]: action.value};
//     default:
//       return state;
//   }
// };
// const TestScreen = () => {
//   // const [userForm, setUserForm] = useState({
//   //   userName: '',
//   //   password: '',
//   // });
//   const [userForm, dispatch] = useReducer(formReducer, {
//     userName: '',
//     password: '',
//   });

//   const handleInputchange = (name: string, value: string) => {
//     // setUserForm(prev => ({
//     //   ...prev,
//     //   [name]: value,
//     // }));
//     dispatch({
//       type: 'SET_INPUT',
//       name,
//       value,
//     });
//   };
//   const welcomeMessage = useMemo(
//     () => `Welcome, ${userForm.userName || 'Guest'}!`,
//     [userForm.userName],
//   );
//   const handleSubmit = () => {
//     console.log(userForm);
//     // useMemoExample;
//   };
//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <TextInput
//         placeholder="Enter username"
//         value={userForm.userName}
//         onChangeText={text => handleInputchange('userName', text)}
//       />
//       <Text>{welcomeMessage}</Text>

//       <TextInput
//         placeholder="Enter password"
//         value={userForm.password}
//         onChangeText={text => handleInputchange('password', text)}
//       />
//       <Button onPress={handleSubmit} title="submit" />
//     </View>
//   );
// };

// export default TestScreen;

// import React, {forwardRef, useImperativeHandle, useRef} from 'react';
// import {Button, TextInput, View} from 'react-native';

// // Child component exposing the `focus` method
// const CustomInput = forwardRef((props, ref) => {
//   const inputRef = useRef(null);

//   // Expose `focus` method to parent
//   useImperativeHandle(ref, () => ({
//     focus: () => {
//       inputRef.current?.focus(); // Focus the input when called
//     },
//   }));

//   return (
//     <TextInput
//       ref={inputRef}
//       placeholder={props?.placeholder}
//       style={{borderBottomWidth: 1, width: 200, marginBottom: 20}}
//     />
//   );
// });

// const TestScreen = () => {
//   // Create a ref for the child component
//   const inputRef = useRef(null);

//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       {/* Child component */}
//       <CustomInput ref={inputRef} placeholder="Enter username" />

//       {/* Button to focus the input field */}
//       <Button title="Focus Input" onPress={() => inputRef.current?.focus()} />
//     </View>
//   );
// };

// export default TestScreen;

import React from 'react';
import {Button, Text, View} from 'react-native';

const TestScreen = () => {
  const person = {
    name: 'samadu',
    address: {city: 'sanfrancisco', country: 'india'},
  };
  // const copyperson = Object.assign({}, person, {names: 'vilakkath'});
  const copyperson = {
    ...person,
    address: {
      ...person.address,
      city: 'bangladesh',
    },
    name: 'bob',
  };

  // function add(a) {
  //   console.log('origina', person);

  //   console.log('copy', copyperson);

  //   return function (b) {
  //     return a + b;
  //   };
  // }
  // const initialState = [];
  // dispacth({
  //   type: 'ADD_BUG',
  //   payload: {id: 0, description: '', resolved: false},
  // });

  // function reducer(state = [], actions) {
  //   if (actions.type === 'ADD_BUG') {
  //     return [
  //       ...state,
  //       {
  //         id: actions.payload.id,
  //         descriptio: action.payload.description,
  //         resolved: actions.payload.resolved,
  //       },
  //     ];
  //   } else if (actions.type === 'REMOVE_BUaG') {
  //     return state.filter(items => items.id !== actions.payload.id);
  //   } else {
  //     return state;
  //   }
  // }

  return (
    <View>
      <Text>ddd</Text>
      <Button title={'click'} onPress={() => {}} />
    </View>
  );
};

export default TestScreen;
