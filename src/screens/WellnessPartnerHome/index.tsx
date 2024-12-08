import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const WellnessPartnerHome = () => {
  const data = [
    {id: 0, title: 'Medicines'},
    {id: 1, title: 'Profile'},
  ];

  const renderCard = ({item}: any) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imageContainer}>
        <Text style={styles.imagePlaceholder}>Image Icon</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.cardText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderCard}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

export default WellnessPartnerHome;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2}, // Shadow for iOS
    shadowOpacity: 0.2, // Shadow for iOS
    shadowRadius: 4, // Shadow for iOS
    width: '45%', // 45% width for two cards per row
    margin: 10, // Spacing between cards
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    color: '#aaa',
  },
  textContainer: {
    padding: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
