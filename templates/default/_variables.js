/*
* Variables to replace
* --------------------
* They are asked to the user as they appear here.
* User input will replace the placeholder  values
* in the template files
*/

module.exports = [
  //'name',
  //'version',
  //'description',
  //'author',
  //'license'
  {
    name: 'name',
    default: 'recipes'
  },
  {
    name: 'author',
    default: 'Darryl Cousins <darryljcousins@gmail.com>'
  },
  {
    name: 'version',
    default: '0.1.0'
  },
  {
    name: 'description',
    default: 'Recipe App'
  },
  {
    name: 'license',
    default: 'MIT'
  }
];
