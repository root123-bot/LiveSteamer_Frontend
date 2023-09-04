{
  /*                HOW I CAPITALIZED A STRING OF WORD(S)

Microsoft Windows [Version 10.0.19044.2251]
(c) Microsoft Corporation. All rights reserved.

D:\PASCHAL'S PROPS\LiveStreamer>node 
Welcome to Node.js v18.12.1.      
Type ".help" for more information.
> a = "Mama anakula ugali"
'Mama anakula ugali'
> b = a.split(' ')
[ 'Mama', 'anakula', 'ugali' ]
> c = a.forEach(value => value[0].toUppercase())
Uncaught TypeError: a.forEach is not a function
> b.forEach(value => value[0].toUpperCase())
undefined
> b = a.split(' ')
[ 'Mama', 'anakula', 'ugali' ]
> b.forEach((value, index) => value[index][0].toUpperCase())
undefined
> b
[ 'Mama', 'anakula', 'ugali' ]
> b.map(value => value[0].toUpperCase())
[ 'M', 'A', 'U' ]
> b
[ 'Mama', 'anakula', 'ugali' ]
> b.forEach(value => value.toUpperCase())
undefined
> b
[ 'Mama', 'anakula', 'ugali' ]
> b.forEach(value => 'Hello')
undefined
> b
[ 'Mama', 'anakula', 'ugali' ]
> b.forEach(value => value[0].toUpperCase() + value.substr(1))
undefined
> b.map(value => value[0].toUpperCase() + value.substr(1))
[ 'Mama', 'Anakula', 'Ugali' ]
> d = b.map(value => value[0].toUpperCase() + value.substr(1))
[ 'Mama', 'Anakula', 'Ugali' ]
> d
[ 'Mama', 'Anakula', 'Ugali' ]
> e = d.join(' ')
'Mama Anakula Ugali'
> k = 'Mama '
'Mama '
> f = k.split(' ')
[ 'Mama', '' ]
> B
Uncaught ReferenceError: B is not defined
> b
[ 'Mama', 'anakula', 'ugali' ]
> b[1] = 'ANAKULA'
'ANAKULA'
> b[2] = 'ugaLI'
'ugaLI'
> b
[ 'Mama', 'ANAKULA', 'ugaLI' ]
> d = b.map(value => value[0].toUpperCase() + value.substr(1))
[ 'Mama', 'ANAKULA', 'UgaLI' ]
> d = b.map(value => value[0].toUpperCase() + value.substr(1).toLowerCase())
[ 'Mama', 'Anakula', 'Ugali' ]
>
*/
}

export function capitalizeString(value) {
  let words = value.trim().split(" ");
  let mapped = words.map(
    (value) => value[0].toUpperCase() + value.substr(1).toLowerCase()
  );

  return mapped.join(" ");
}
