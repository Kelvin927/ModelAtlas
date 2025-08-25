import numpy as np
import matplotlib.pyplot as plt

X = np.array([[250,16,12,5],[200,16,8,3],[300,32,16,4],[275,32,8,4],[225,16,16,2]], dtype=float)
w = np.array([0.35,0.25,0.25,0.15])
cost = np.array([False, False, False, True])

norm = X/np.sqrt((X**2).sum(axis=0))
v = norm*w
ideal = np.where(cost, v.min(axis=0), v.max(axis=0))
ante = np.where(cost, v.max(axis=0), v.min(axis=0))
S_pos = np.sqrt(((v-ideal)**2).sum(axis=1))
S_neg = np.sqrt(((v-ante)**2).sum(axis=1))
C = S_neg/(S_pos+S_neg)

plt.bar(range(len(C)), C)
plt.xlabel('Alternative')
plt.ylabel('Score')
plt.title('TOPSIS Ranking')
plt.savefig('output.png')
print('Ranking (desc):', np.argsort(-C))