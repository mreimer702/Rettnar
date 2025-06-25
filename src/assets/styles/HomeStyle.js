import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 80,
  },

  /* --- Location & Search --- */
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBox: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
    backgroundColor: 'black',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    marginLeft: 10,
  },
  subText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },

  /* --- Filter Buttons --- */
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  filterButtonLarge: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 16,
    color: 'black',
  },
  activeFilterButton: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  /* --- Carousel --- */
  featuredContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  carouselItem: {
    width: width,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
    opacity: 0.5,
  },
  activeDot: {
    backgroundColor: 'black',
    opacity: 1,
  },

  /* --- Recommended Sections --- */
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  favorite: {
    color: 'red',
    fontWeight: 'bold',
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'red',
  },

  /* --- Bottom Nav --- */
  /* --- The bottom nav bar component import the style from this file ---*/
  // Bottom nav bar - matched with HomePage
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute', // fixed to bottom
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: 'gray',
  },
});
