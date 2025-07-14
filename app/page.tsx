"use client";

// Frontend with Drag-and-Drop Support & Dynamic Indicators

import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectItem, SelectContent, SelectTrigger } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Plus, Trash2 } from "lucide-react";

const INDICATOR_LIST = [
  { id: 'rsi', label: 'RSI' },
  { id: 'macd', label: 'MACD' },
  { id: 'ema', label: 'EMA' },
  { id: 'sma', label: 'SMA' },
  { id: 'adx', label: 'ADX' },
  { id: 'bb', label: 'Bollinger Bands' },
  { id: 'vwap', label: 'VWAP' },
];

const TABS = ["equity", "options", "futures", "commodity"];

export default function AlgoTradingPlatform() {
  const [activeTab, setActiveTab] = useState("equity");

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 grid gap-4">
        <h1 className="text-3xl font-bold">Algo Trading Builder</h1>

        <div className="flex gap-2">
          {TABS.map(tab => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? "default" : "outline"}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {TABS.map(tab => (
          activeTab === tab ? (
            <StrategyBuilder key={tab} sector={tab} />
          ) : null
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">📄 Paper Trading</h2>
              <Button className="w-full">Start Backtesting</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">🔗 Connect Broker</h2>
              <Select>
                <SelectTrigger className="w-full">Select Broker</SelectTrigger>
                <SelectContent>
                  <SelectItem value="zerodha">Zerodha</SelectItem>
                  <SelectItem value="fyers">Fyers</SelectItem>
                  <SelectItem value="angel">Angel One</SelectItem>
                  <SelectItem value="upstox">Upstox</SelectItem>
                  <SelectItem value="kotak">Kotak Neo</SelectItem>
                </SelectContent>
              </Select>
              <Button className="mt-2 w-full">Connect</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">🤖 Company AI Trading Bot</h2>
            <p className="text-sm text-muted-foreground">Run trades using our proprietary AI. Backend will be integrated later.</p>
            <Button className="mt-2">Run AI Bot</Button>
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
}

function StrategyBuilder({ sector }) {
  const [strategy, setStrategy] = useState([]);

  const moveCard = (dragIndex, hoverIndex) => {
    const dragged = strategy[dragIndex];
    const updated = [...strategy];
    updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, dragged);
    setStrategy(updated);
  };

  const [, drop] = useDrop({
    accept: 'indicator',
    drop: (item) => setStrategy((prev) => [...prev, { ...item, config: {} }]),
  });

  const handleConfigChange = (index, field, value) => {
    const updated = [...strategy];
    updated[index].config[field] = value;
    setStrategy(updated);
  };

  const handleDelete = (index) => {
    const updated = [...strategy];
    updated.splice(index, 1);
    setStrategy(updated);
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">📈 Strategy Builder ({sector})</h2>

        {/* Drop Area */}
        <div ref={drop} className="border p-4 rounded-lg bg-muted min-h-[300px]">
          {strategy.length === 0 ? (
            <p className="text-muted-foreground">Drag indicators below to build your strategy.</p>
          ) : (
            strategy.map((ind, idx) => (
              <DraggableItem
                key={idx}
                index={idx}
                id={ind.id}
                label={ind.label}
                config={ind.config}
                moveCard={moveCard}
                onConfigChange={handleConfigChange}
                onDelete={() => handleDelete(idx)}
              />
            ))
          )}
        </div>

        {/* Indicators Section */}
        <div>
          <h3 className="font-medium mb-2">Available Indicators</h3>
          <div className="flex flex-wrap gap-2">
            {INDICATOR_LIST.map((indicator) => (
              <DraggableIndicator key={indicator.id} indicator={indicator} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DraggableItem({ id, label, index, moveCard, config, onConfigChange, onDelete }) {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: 'strategy-item',
    hover(item) {
      if (item.index === index) return;
      moveCard(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'strategy-item',
    item: { id, index },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="p-2 bg-white border rounded mb-2 space-y-2"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold">{label}</span>
        <Trash2 className="w-4 h-4 cursor-pointer text-red-500" onClick={onDelete} />
      </div>
      {label === 'RSI' && (
        <Input
          type="number"
          placeholder="RSI Period"
          value={config.period || ''}
          onChange={(e) => onConfigChange(index, 'period', e.target.value)}
        />
      )}
      {/* Add more configs for other indicators here if needed */}
    </div>
  );
}

function DraggableIndicator({ indicator }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'indicator',
    item: indicator,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Button
      ref={drag}
      variant="outline"
      className="cursor-move"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {indicator.label}
    </Button>
  );
}
