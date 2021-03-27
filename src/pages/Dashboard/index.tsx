import { useCallback, useEffect, useState } from "react";
import Food from "../../components/Food";
import { Header } from "../../components/Header";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { api } from "../../services/api";
import { FoodsContainer } from "./styles";

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface EditingFoodProps {
  food: FoodProps;
  editingModalOpen: boolean;
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [editingFood, setEditingFood] = useState({} as EditingFoodProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api.get("/foods").then((response) => {
      setFoods(response.data);
    });
  }, []);

  const handleAddFood = useCallback(
    async (food) => {
      try {
        const response = await api.post("/foods", {
          ...food,
          available: true,
        });

        setFoods([...foods, response.data]);
      } catch (err) {
        console.log(err);
      }
    },
    [foods]
  );

  const handleUpdateFood = useCallback(
    async (food: FoodProps) => {
      try {
        const foodUpdated = await api.put(`/foods/${editingFood.food.id}`, {
          ...editingFood,
          ...food,
        });

        const foodsUpdated = foods.map((f) =>
          f.id !== foodUpdated.data.id ? f : foodUpdated.data
        );

        setFoods(foodsUpdated);
      } catch (err) {
        console.log(err);
      }
    },
    [editingFood, foods]
  );

  const handleDeleteFood = useCallback(
    async (id) => {
      await api.delete(`/foods/${id}`);
      const foodsFiltered = foods.filter((food) => food.id !== id);
      setFoods(foodsFiltered);
    },
    [foods]
  );

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen);
  }, [editModalOpen]);

  const handleEditFood = useCallback((food) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }, []);

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
          foods.map((food) => (
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
