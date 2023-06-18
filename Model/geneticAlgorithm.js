
// Функция для генерации случайного числа в заданном диапазоне
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  //Функция для создания случайного раскроя

function createRandomCutting(blocks, sheetWidth, sheetHeight) {
    const cutting = [];
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      let isIntersecting = false;
      
      do {
        const x = getRandomNumber(0, sheetWidth - block.w);
        const y = getRandomNumber(0, sheetHeight - block.h);
        const orientation = getRandomNumber(0, 1) < 0.5 ? "vertical" : "horizontal";
        const newRect = { block, x, y, orientation };
  
        isIntersecting = false;
        for (let j = 0; j < cutting.length; j++) {
          const existingRect = cutting[j];
          if (areRectanglesIntersecting(newRect, existingRect)) {
            isIntersecting = true;
            break;
          }
        }
  
        if (!isIntersecting) {
          cutting.push({ block, x, y, orientation });
        }
      } while (isIntersecting);
    }
  
    return cutting;
  }

  function areRectanglesIntersecting(rect1, rect2) {
    var rect1Widht, rect1Height, rect2Widht, rect2Height;
    if(rect1.orientation === "horizontal"){
        rect1Widht = rect1.block.h;
        rect1Height = rect1.block.w;
    }else{
        rect1Widht = rect1.block.w;
        rect1Height = rect1.block.h;
    }
    if(rect2.orientation === "horizontal"){
        rect2Widht = rect2.block.h;
        rect2Height = rect2.block.w;
    }else{
        rect2Widht = rect2.block.w;
        rect2Height = rect2.block.h;
    }
    if (
      rect1.x + rect1Widht < rect2.x ||
      rect2.x + rect2Widht < rect1.x ||
      rect1.y + rect1Height < rect2.y ||
      rect2.y + rect2Height < rect1.y
    ) {
      // Прямоугольники не пересекаются
      return false;
    } else {
      // Прямоугольники пересекаются
      return true;
    }
  }  

function evaluateFitness(cutting, sheetWidth, sheetHeight) {
    const sheets = performCutting(cutting, sheetWidth, sheetHeight);
  
    let compactnessSum = 0;
    let blockCount = 0;
  
    for (let i = 0; i < sheets.length; i++) {
      const sheet = sheets[i];
  
      const compactness = calculateCompactness(sheet.blocks);
  
      compactnessSum += compactness;
      blockCount += sheet.blocks.length;
    }
  
    // Вычисляем среднюю компактность и среднюю площадь пустых областей по всем листам раскроя
    const averageCompactness = compactnessSum / blockCount;
  
    return {
      fitness: averageCompactness,
    };
  }
  
  function calculateCompactness(blocks) {
    let totalDistance = 0;
  
    for (let i = 0; i < blocks.length; i++) {
      const block1 = blocks[i];
  
      for (let j = i + 1; j < blocks.length; j++) {
        const block2 = blocks[j];
  
        const distance = calculateDistance(block1, block2);
        totalDistance += distance;
      }
    }
  
    const totalPairs = (blocks.length * (blocks.length - 1)) / 2;
    const averageDistance = totalDistance / totalPairs;
  
    // Используем обратное значение среднего расстояния, чтобы получить компактность
    const compactness = 1 / averageDistance;
  
    return compactness;
  }
  
  function calculateDistance(block1, block2) {
    const dx = block1.x - block2.x;
    const dy = block1.y - block2.y;
  
    // Используем теорему Пифагора для расчета расстояния между точками
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    return distance;
  }
  
  function createCells(sheetWidth, sheetHeight, cellSize) {
    const rows = Math.ceil(sheetHeight / cellSize);
    const columns = Math.ceil(sheetWidth / cellSize);
    const cells = [];
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        cells.push({ row, col, occupied: false });
      }
    }
  
    return cells;
  }
  
  function markOccupiedCells(cells, blocks, cellSize) {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const { x, y, w, h, orientation } = block;
  
      const startX = Math.floor(x / cellSize);
      const startY = Math.floor(y / cellSize);
      const endX = Math.ceil((x + (orientation === "vertical" ? h : w)) / cellSize);
      const endY = Math.ceil((y + (orientation === "vertical" ? w : h)) / cellSize);
  
      for (let row = startY; row < endY; row++) {
        for (let col = startX; col < endX; col++) {
          const cellIndex = row * Math.ceil(cells.length / endY) + col;
          cells[cellIndex].occupied = true;
        }
      }
    }
  }
  
  function calculateTotalCells(cells) {
    return cells.length;
  }
  
  function countEmptyCells(cells) {
    let emptyCellCount = 0;
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].occupied) {
        emptyCellCount++;
      }
    }
    return emptyCellCount;
  }
  
  function createInitialPopulation(populationSize, blocks, sheetWidth, sheetHeight) {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
      const cutting = createRandomCutting(blocks, sheetWidth,sheetHeight);
      const fitness = evaluateFitness(cutting, sheetWidth, sheetHeight);
      population.push({ cutting, fitness });
    }
    return population;
  }
  
  // Функция для выбора родителей для скрещивания
  function selectParents(population) {
    const parent1 = tournamentSelection(population, 2);
    let parent2 = tournamentSelection(population, 2);
    while (parent2 === parent1) {
      parent2 = tournamentSelection(population, 2);
    }
    return [parent1, parent2];
  }
  
  // Функция для выполнения операции скрещивания (одноточечное скрещивание)
function crossover(parent1, parent2) {
    const cutting1 = parent1.cutting;
    const cutting2 = parent2.cutting;
    const child1 = [];
    const child2 = [];
    var isIntersecting = false;
    // Выбираем случайную точку разреза
    const cuttingPoint = Math.floor(Math.random() * cutting1.length);
  
    // Создаем потомков путем комбинирования генов родителей
    for (let i = 0; i < cutting1.length; i++) {
      let newBlock1, newBlock2;
  
      if (i < cuttingPoint) {
        newBlock1 = cutting1[i];
        newBlock2 = cutting2[i];
      } else {
        newBlock1 = cutting2[i];
        newBlock2 = cutting1[i];
      }


      // Проверяем пересечение с другими блоками в потомке 1
      if (!checkBlockIntersection(newBlock1, child1, -1)) {
        child1.push(newBlock1);
      }else{
        isIntersecting = true;
        break;
      }
      // Проверяем пересечение с другими блоками в потомке 2
      if (!checkBlockIntersection(newBlock2, child2, -1)) {
        child2.push(newBlock2);
      } else{
        isIntersecting = true;
        break;
      }
    }
  if(isIntersecting){
    return [{ cutting: parent1.cutting }, { cutting: parent2.cutting }];
  }else{
    return [{ cutting: child1 }, { cutting: child2 }];
  }
    
  }

// Update the mutate function to include the new mutations
function mutate(individual, mutationRate, sheetWidth, sheetHeight) {
    const cutting = individual.cutting;
    if (Math.random() < mutationRate) {
      const mutationType = Math.random();
  
      if (mutationType < 0.33) {
        // Perform place exchange mutation
        return placeExchangeMutation(cutting);
      } else if (mutationType < 0.66) {
        // Perform random coordinate mutation
        return randomCoordinateMutation(cutting, sheetWidth, sheetHeight);
      } else {
        // Perform random orientation mutation
        return randomOrientationMutation(cutting);
      }
    }
  
    return cutting;
  }
  
  function placeExchangeMutation(cutting) {
    const mutatedCutting = [...cutting];
    const index1 = Math.floor(Math.random() * mutatedCutting.length);
    let index2 = Math.floor(Math.random() * mutatedCutting.length);
  
    // Ensure index2 is different from index1
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * mutatedCutting.length);
    }
  
    // Swap the positions of blocks at index1 and index2
    [mutatedCutting[index1], mutatedCutting[index2]] = [mutatedCutting[index2], mutatedCutting[index1]];
  
    // Check for intersection with other blocks
    if (!checkBlockIntersection(mutatedCutting[index1], mutatedCutting, index1) && !checkBlockIntersection(mutatedCutting[index2], mutatedCutting, index2)) {
      return mutatedCutting;
    } else {
      // If there is intersection, revert the swap
      [mutatedCutting[index1], mutatedCutting[index2]] = [mutatedCutting[index2], mutatedCutting[index1]];
      return cutting;
    }
  }
  
  function randomCoordinateMutation(cutting, sheetWidth, sheetHeight) {
    const mutatedCutting = [...cutting];
    const index = Math.floor(Math.random() * mutatedCutting.length);
    const block = mutatedCutting[index];
  
    // Generate new random coordinates within the sheet bounds
    const newBlock = {
      ...block,
      x: Math.random() * (sheetWidth - block.w),
      y: Math.random() * (sheetHeight - block.h),
    };
  
    // Check for intersection with other blocks
    if (!checkBlockIntersection(newBlock, mutatedCutting, index)) {
      mutatedCutting[index] = newBlock;
      return mutatedCutting;
    } else {
      return cutting;
    }
  }
  
  function randomOrientationMutation(cutting) {
    const mutatedCutting = [...cutting];
    const index = Math.floor(Math.random() * mutatedCutting.length);
    const block = mutatedCutting[index];
  
    // Generate new random orientation (e.g., rotate the block by 90 degrees)
    const newBlock = {
      ...block,
      orientation: getRandomNumber(0, 1) < 0.5 ? "vertical" : "horizontal",
    };
  
    // Check for intersection with other blocks
    if (!checkBlockIntersection(newBlock, mutatedCutting, index)) {
      mutatedCutting[index] = newBlock;
      return mutatedCutting;
    } else {
      return cutting;
    }
  }
  
  function checkBlockIntersection(block, cutting, currentIndex) {
    for (let i = 0; i < cutting.length; i++) {
      if (i !== currentIndex) {
        const otherBlock = cutting[i];
        if (areRectanglesIntersecting(block, otherBlock)) {
          return true; // Intersection detected
        }
      }
    }
    return false; // No intersection detected
  }
  
  // Функция для выполнения операции раскроя на листовой материал
  function performCutting(cutting, sheetWidth, sheetHeight) {
    const sheets = [];
    let currentSheet = { width: sheetWidth, height: sheetHeight, blocks: [] };
  
    for (let i = 0; i < cutting.length; i++) {
      const { block, x, y, orientation } = cutting[i];
      const blockWidth = orientation === "vertical" ? block.w : block.h;
      const blockHeight = orientation === "vertical" ? block.h : block.w;
  
      if (blockWidth > currentSheet.width || blockHeight > currentSheet.height) {
        // Создаем новый лист и размещаем блок на нем
        sheets.push(currentSheet);
        currentSheet = { width: sheetWidth, height: sheetHeight, blocks: [] };
      }
  
      // Записываем координаты блока на текущем листе
      currentSheet.blocks.push({ block, x, y, orientation });
  
      // Обновляем размеры текущего листа
      if (orientation === "vertical") {
        currentSheet.height -= blockHeight;
      } else {
        currentSheet.width -= blockWidth;
      }
    }
  
    // Добавляем последний лист в список
    sheets.push(currentSheet);
  
    return sheets;
  }
  
  // Функция для выполнения турнирной селекции
  function tournamentSelection(population, tournamentSize) {
    let bestIndividual = population[Math.floor(Math.random() * population.length)];
    for (let i = 1; i < tournamentSize; i++) {
      const randomIndividual = population[Math.floor(Math.random() * population.length)];
      if (randomIndividual.fitness.fitness > bestIndividual.fitness.fitness) {
        bestIndividual = randomIndividual;
      }
    }
    return bestIndividual;
  }
  
  // Основная функция генетического алгоритма
  function runGeneticAlgorithm(populationSize, mutationRate, generations, blocks, sheetWidth, sheetHeight) {
    let population = createInitialPopulation(populationSize, blocks, sheetWidth, sheetHeight);
    
    for (let generation = 0; generation < generations; generation++) {
      const newPopulation = [];
  
      while (newPopulation.length < populationSize) {
        // Выбираем родителей для скрещивания
        const [parent1, parent2] = selectParents(population);
  
        // Выполняем скрещивание
        const [child1, child2] = crossover(parent1, parent2);
  
        // Выполняем мутацию на потомков
        child1.cutting = mutate(child1, mutationRate, sheetWidth, sheetHeight);
        child2.cutting = mutate(child2, mutationRate, sheetWidth, sheetHeight);
  
        // Вычисляем приспособленность для потомков
        const child1Fitness = evaluateFitness(child1.cutting, sheetWidth, sheetHeight);
        const child2Fitness = evaluateFitness(child2.cutting, sheetWidth, sheetHeight);
  
        // Добавляем потомков в новую популяцию
        newPopulation.push({ cutting: child1.cutting, fitness: child1Fitness });
        newPopulation.push({ cutting: child2.cutting, fitness: child2Fitness });
      }
  
      // Заменяем текущую популяцию новой популяцией
      population = newPopulation;
  
      // Выводим лучшую приспособленность в текущем поколении
    //   let bestFitness = 0;
    //   let bestIndividual;
    //   for (let i = 0; i < population.length; i++) {
    //     const { fitness } = population[i];
    //     if (fitness.fitness > bestFitness) {
    //       bestFitness = fitness.fitness;
    //       bestIndividual = population[i];
    //     }
    //   }
      //console.log(`Generation ${generation + 1}: Best Fitness = ${bestFitness}`);
    }
  
    // Возвращаем лучшего индивида из последнего поколения
    let bestFitness = 0;
    let bestIndividual;
    for (let i = 0; i < population.length; i++) {
      const { fitness } = population[i];
      if (fitness.fitness > bestFitness) {
        bestFitness = fitness.fitness;
        bestIndividual = population[i];
      }
    }
    return bestIndividual;
  }
  

  
  
