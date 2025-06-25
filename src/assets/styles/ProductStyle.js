import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  imagePlaceholder: {
    height: 200,
    backgroundColor: '#eee',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  ownerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  ownerResponse: {
    fontSize: 13,
    color: 'gray',
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  star: {
    color: 'gold',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 16,
  },

  descCard: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
  },
  descIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    marginRight: 10,
    borderRadius: 8,
  },
  descContent: {
    flex: 1,
  },
  descTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },

  mapPlaceholder: {
    height: 150,
    backgroundColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
  },

  priceBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  messageButton: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  rentButton: {
    flex: 1,
    padding: 14,
    backgroundColor: 'black',
    borderRadius: 8,
    alignItems: 'center',
  },
  rentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  relatedCard: {
    width: 160,
    backgroundColor: '#f3f3f3',
    padding: 10,
    marginRight: 12,
    borderRadius: 8,
  },
  relatedImage: {
    height: 100,
    backgroundColor: '#ccc',
    marginBottom: 8,
    borderRadius: 6,
  },
  relatedTitle: {
    fontWeight: 'bold',
  },
  relatedPrice: {
    color: 'red',
  },
});
