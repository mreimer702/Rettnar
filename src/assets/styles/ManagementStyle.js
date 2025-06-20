import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  searchButton: {
    padding: 8,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  subText: {
    fontSize: 14,
    color: 'gray',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    width: 150,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'red',
  },
  status: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
  },
});
