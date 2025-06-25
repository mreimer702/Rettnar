import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderSummaryCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 24,
    overflow: 'hidden',
  },
  thumbnail: {
    height: 180,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalPrice: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#eee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryDetails: {
    padding: 12,
    backgroundColor: '#fff',
  },
  productTitle: {
    fontSize: 14,
    color: '#333',
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  termsBox: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  payButton: {
    backgroundColor: 'black',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
