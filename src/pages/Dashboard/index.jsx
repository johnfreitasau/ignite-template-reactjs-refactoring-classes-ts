import { useCallback, useEffect, useState } from 'react';
import Food from '../../components/Food';
import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { api } from '../../services/api';
import { FoodsContainer } from './styles';

export function Dashboard() {

  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  useEffect(() => {
    api.get('/foods').then(response => {
      setFoods(response.data)
    });
    
  },[])

    const handleAddFood = useCallback(async (food) => {

      try {
        const response = await api.post('/foods', {
          ...food,
          available: true,
        });

        setFoods({ foods: [...foods, response.data] });
      } catch (err) {
        console.log(err);
      }

    },[foods])

    const handleUpdateFood = useCallback(async (food) => {

      try {
        const foodUpdated = await api.put(
          `/foods/${editingFood.id}`,
          { ...editingFood, ...food },
        );

        const foodsUpdated = foods.map(f =>
          f.id !== foodUpdated.data.id ? f : foodUpdated.data,
        );

        this.setState({ foods: foodsUpdated });
      } catch (err) {
        console.log(err);
      }

    },[editingFood, foods])

    const handleDeleteFood = useCallback(async (id) => {

      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter(food => food.id !== id);

      this.setState({ foods: foodsFiltered });

    }, [foods])

    const toggleModal = useCallback(() => {

      this.setState({ modalOpen: !modalOpen });

    }, [modalOpen])
  
    const toggleEditModal = useCallback(() => {
      setEditModalOpen({ editModalOpen: !editModalOpen });
    }, [editModalOpen])

    const handleEditFood = useCallback((food) => {
      setEditingFood({ editingFood: food, editModalOpen: true });
    },[])

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
}

