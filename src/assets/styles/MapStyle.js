import {StyleSheet, Dimensions} from 'react-native';

const {height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  /* Search Input */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
    backgroundColor: 'black',
    borderRadius: 6,
    marginLeft: 6,
  },
  subText: {
    fontSize: 13,
    color: 'gray',
    marginLeft: 18,
    marginTop: 4,
  },

  /* Map Placeholder Section (for frontend testing only) */
  mapPlaceholder: {
    height: height * 0.45,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  rangeInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },

  /* Save Button */
  saveButton: {
    backgroundColor: 'black',
    paddingVertical: 14,
    marginHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* Actual map component (optional, if used later) */
  map: {
    height: height * 0.45,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },

  sliderContainer: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  sliderLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },
});
