import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  draftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  draftInfo: {
    flexDirection: 'column',
  },
  draftTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  draftDate: {
    fontSize: 14,
    color: 'gray',
  },
  draftStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ready: {
    color: 'green',
  },
  incomplete: {
    color: 'red',
  },
  emptyText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});
