from numpy import genfromtxt
import numpy as np
import os
import csv
import matplotlib.pyplot as plt
import networkx as nx

matrix = genfromtxt(os.path.dirname(os.path.realpath(__file__)) + '/matrix.csv', delimiter=',')
vertexes = []
with open(os.path.dirname(os.path.realpath(__file__)) + '/vert.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    for row in spamreader:
        vertexes = row
        break


def show_graph_with_labels(adjacency_matrix, labels):
    rows, cols = np.where(adjacency_matrix == 1)
    edges = zip(rows.tolist(), cols.tolist())
    gr = nx.Graph()
    gr.add_edges_from(edges)
    nx.draw(gr, node_size=500, labels=labels, with_labels=True)
    plt.show()

show_graph_with_labels(matrix, {i: vertexes[i] for i in range(len(vertexes))})
