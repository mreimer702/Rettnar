import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginHorizontal: 8,
    backgroundColor: 'white', // Default white background
  },
  activeButton: {
    backgroundColor: 'black', // Black background when active
    borderColor: 'black',
  },
  filterText: {
    fontSize: 16,
    color: 'black', // Black text by default
  },
  activeFilterText: {
    color: 'white', // White text when active
  },
  list: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    backgroundColor: '#007bff',
  },
  alert: {
    backgroundColor: '#ffc107',
  },
  success: {
    backgroundColor: '#28a745',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    color: 'gray',
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  dismissButton: {
    backgroundColor: '#dc3545',
    margin: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dismissText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
